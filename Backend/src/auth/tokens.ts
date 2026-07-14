import { db } from "../lib/db.js";
import { encrypt, decrypt } from "../lib/crypto.js";
import type { Credentials } from "google-auth-library";

/* OAuth token storage — encrypted at rest, per delivery.md.
 *
 * `scopes` is stored as a space-separated string (OAuth 2.0 format).
 * Every write is a union with existing scopes — per ADR-0006's incremental
 * authorization model. We never shrink the scope set except on explicit
 * revocation. */

interface StoreArgs {
  userId: string;
  credentials: Credentials;
  additionalScopes?: string[];
}

export async function storeGoogleTokens({ userId, credentials, additionalScopes = [] }: StoreArgs) {
  if (!credentials.access_token) throw new Error("credentials.access_token missing");
  if (!credentials.expiry_date)  throw new Error("credentials.expiry_date missing");

  const existing = await db.oAuthToken.findUnique({
    where: { userId_provider: { userId, provider: "google" } },
  });

  const scopeSet = new Set<string>([
    ...(existing ? existing.scopes.split(" ").filter(Boolean) : []),
    ...(credentials.scope ? credentials.scope.split(" ") : []),
    ...additionalScopes,
  ]);

  await db.oAuthToken.upsert({
    where: { userId_provider: { userId, provider: "google" } },
    create: {
      userId,
      provider: "google",
      accessToken: encrypt(credentials.access_token),
      refreshToken: credentials.refresh_token ? encrypt(credentials.refresh_token) : null,
      expiresAt: new Date(credentials.expiry_date),
      scopes: [...scopeSet].join(" "),
    },
    update: {
      accessToken: encrypt(credentials.access_token),
      // Only overwrite refresh_token if Google actually returned a new one.
      // On incremental grants they usually don't — we keep the old one.
      ...(credentials.refresh_token ? { refreshToken: encrypt(credentials.refresh_token) } : {}),
      expiresAt: new Date(credentials.expiry_date),
      scopes: [...scopeSet].join(" "),
    },
  });
}

export async function loadGoogleCredentials(userId: string): Promise<Credentials | null> {
  const row = await db.oAuthToken.findUnique({
    where: { userId_provider: { userId, provider: "google" } },
  });
  if (!row) return null;
  return {
    access_token: decrypt(row.accessToken),
    refresh_token: row.refreshToken ? decrypt(row.refreshToken) : null,
    expiry_date: row.expiresAt.getTime(),
    scope: row.scopes,
    token_type: "Bearer",
  };
}

export async function userHasScope(userId: string, scope: string): Promise<boolean> {
  const row = await db.oAuthToken.findUnique({
    where: { userId_provider: { userId, provider: "google" } },
    select: { scopes: true },
  });
  if (!row) return false;
  return row.scopes.split(" ").includes(scope);
}
