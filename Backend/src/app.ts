import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import session from "@fastify/session";
import cors from "@fastify/cors";
import { config } from "./config.js";
import { authRoutes } from "./auth/routes.js";
import { deliveryRoutes } from "./delivery/routes.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: process.env.NODE_ENV === "production" ? "info" : "debug" },
  });

  await app.register(cors, {
    origin: config.FRONTEND_ORIGIN,
    credentials: true,   // required for session cookie
  });

  await app.register(cookie);
  await app.register(session, {
    secret: config.SESSION_SECRET,
    cookieName: "jarvis.sid",
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
    },
  });

  app.get("/health", async () => ({ ok: true, service: "jarvis-backend" }));

  await app.register(authRoutes);
  await app.register(deliveryRoutes);

  return app;
}
