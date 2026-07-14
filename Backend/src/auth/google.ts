import { google, Auth } from "googleapis";
import { config } from "../config.js";

/* Google OAuth client factory + scope catalogue.
 *
 * Per ADR-0006, scopes are requested INCREMENTALLY — never bundled at sign-in.
 * The three named grants map to onboarding beats: identity at /auth/google,
 * calendar.events at /auth/google/grant?scope=calendar, gmail.send at
 * /auth/google/grant?scope=gmail. */

export const SCOPES = {
  identity: [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
  calendar: ["https://www.googleapis.com/auth/calendar.events"],
  gmail: ["https://www.googleapis.com/auth/gmail.send"],
} as const;

export type ScopeGroup = keyof typeof SCOPES;

export function makeOAuthClient(): Auth.OAuth2Client {
  return new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URI
  );
}

/* Build the authorization URL for a given scope group.
 *
 * `include_granted_scopes=true` is the incremental-authorization mechanism —
 * Google unions the requested scope with anything the user has already granted,
 * so we never ask twice for the same scope, and consent screens show only the
 * new addition. */
export function buildAuthUrl(scopeGroup: ScopeGroup, state: string): string {
  const client = makeOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",           // request a refresh_token
    prompt: scopeGroup === "identity" ? "consent" : undefined,
    include_granted_scopes: true,
    scope: SCOPES[scopeGroup] as unknown as string[],
    state,
  });
}
