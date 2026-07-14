import "dotenv/config";
import { z } from "zod";

/* Environment config, parsed and validated once at startup.
 * Anything downstream imports `config` from here — never process.env directly. */

const schema = z.object({
  PORT:                   z.coerce.number().default(4000),
  BASE_URL:               z.string().url(),
  FRONTEND_ORIGIN:        z.string().url(),
  SESSION_SECRET:         z.string().min(32),
  DATABASE_URL:           z.string().min(1),
  GOOGLE_CLIENT_ID:       z.string().min(1),
  GOOGLE_CLIENT_SECRET:   z.string().min(1),
  GOOGLE_REDIRECT_URI:    z.string().url(),
  TOKEN_ENCRYPTION_KEY:   z.string().length(64),  // 32 bytes as hex
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  console.error("\nSee Backend/.env.example for the template.");
  process.exit(1);
}

export const config = parsed.data;
