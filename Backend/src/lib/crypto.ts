import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { config } from "../config.js";

/* Symmetric AES-256-GCM encryption for OAuth tokens at rest, per delivery.md.
 *
 * Key rotation is out of scope for this scaffold — when it becomes real, the
 * ciphertext format will need a key-id prefix and a key registry. Called out
 * as a follow-up rather than pretended solved. */

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(config.TOKEN_ENCRYPTION_KEY, "hex");
const IV_LENGTH = 12;   // GCM standard
const TAG_LENGTH = 16;

export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64");
}

export function decrypt(ciphertext: string): string {
  const buf = Buffer.from(ciphertext, "base64");
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ct = buf.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}
