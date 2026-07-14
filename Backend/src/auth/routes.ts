import type { FastifyInstance } from "fastify";
import { randomBytes } from "node:crypto";
import { google } from "googleapis";
import { db } from "../lib/db.js";
import { config } from "../config.js";
import { makeOAuthClient, buildAuthUrl, SCOPES, type ScopeGroup } from "./google.js";
import { storeGoogleTokens } from "./tokens.js";

/* Google OAuth routes.
 *
 * Three entry points per ADR-0006's consent choreography:
 *   GET  /auth/google                      → identity-only sign-in
 *   GET  /auth/google/grant?scope=calendar → incremental calendar.events
 *   GET  /auth/google/grant?scope=gmail    → incremental gmail.send
 *   GET  /auth/google/callback             → exchange code, store tokens
 *
 * State parameter is a signed nonce stored in the session — prevents CSRF
 * and lets us know which scope group the callback is settling. */

declare module "fastify" {
  interface Session {
    userId?: string;
    oauthState?: { nonce: string; scopeGroup: ScopeGroup; next?: string };
  }
}

export async function authRoutes(app: FastifyInstance) {
  /* Identity sign-in — the first consent moment. */
  app.get("/auth/google", async (req, reply) => {
    const nonce = randomBytes(16).toString("hex");
    req.session.oauthState = { nonce, scopeGroup: "identity" };
    return reply.redirect(buildAuthUrl("identity", nonce));
  });

  /* Incremental grants — second and third consent moments.
   * Requires an active session; you must be signed in first. */
  app.get<{ Querystring: { scope?: string; next?: string } }>("/auth/google/grant", async (req, reply) => {
    if (!req.session.userId) {
      return reply.code(401).send({ error: "sign-in required first" });
    }
    const requested = req.query.scope;
    if (requested !== "calendar" && requested !== "gmail") {
      return reply.code(400).send({ error: "scope must be 'calendar' or 'gmail'" });
    }
    const nonce = randomBytes(16).toString("hex");
    req.session.oauthState = { nonce, scopeGroup: requested, next: req.query.next };
    return reply.redirect(buildAuthUrl(requested, nonce));
  });

  /* Callback — one endpoint for all three grants; state carries the scope group. */
  app.get<{ Querystring: { code?: string; state?: string; error?: string } }>(
    "/auth/google/callback",
    async (req, reply) => {
      const { code, state, error } = req.query;
      const expected = req.session.oauthState;

      if (error)                                        return reply.code(400).send({ error });
      if (!code || !state || !expected)                 return reply.code(400).send({ error: "missing code/state" });
      if (state !== expected.nonce)                     return reply.code(400).send({ error: "state mismatch" });

      const client = makeOAuthClient();
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      let userId = req.session.userId;

      /* Identity flow: fetch profile, upsert user, start session. */
      if (expected.scopeGroup === "identity") {
        const oauth2 = google.oauth2({ auth: client, version: "v2" });
        const { data: profile } = await oauth2.userinfo.get();
        if (!profile.id || !profile.email)              return reply.code(500).send({ error: "profile fetch failed" });

        const user = await db.user.upsert({
          where: { googleSub: profile.id },
          create: {
            googleSub: profile.id,
            email:     profile.email,
            name:      profile.name ?? profile.email.split("@")[0],
          },
          update: { email: profile.email, name: profile.name ?? undefined },
        });
        userId = user.id;
        req.session.userId = user.id;
      }

      /* Store the tokens against the (now-known) userId — identity or incremental. */
      if (!userId) return reply.code(500).send({ error: "no userId after identity flow" });
      await storeGoogleTokens({
        userId,
        credentials: tokens,
        additionalScopes: [...SCOPES[expected.scopeGroup]],
      });

      /* Clear the pending state and redirect to the frontend. */
      const next = expected.next ?? `${config.FRONTEND_ORIGIN}/#/today`;
      req.session.oauthState = undefined;
      return reply.redirect(next);
    }
  );

  /* Sign-out — clear the session cookie. Does not revoke Google tokens
   * (the user does that from their Google Account settings; see delivery.md). */
  app.delete("/auth/session", async (req, reply) => {
    await req.session.destroy();
    return reply.code(204).send();
  });

  /* Session probe — the Frontend calls this on boot to see if we're signed in. */
  app.get("/auth/session", async (req, reply) => {
    if (!req.session.userId) return reply.code(401).send({ authenticated: false });
    const user = await db.user.findUnique({ where: { id: req.session.userId } });
    if (!user)               return reply.code(401).send({ authenticated: false });
    return reply.send({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        honorific: user.honorific,
        register: user.register,
      },
    });
  });
}
