/* Helpers for partner / member display. */

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* Deterministic muted-tint palette for monogram avatars.
 * Each tint is paired with the brass/sage/dust family — never bright,
 * never out-of-system. The hash is name-stable so a partner keeps
 * their tint across sessions. */
const TINTS = [
  { bg: "var(--ds-brass-tint)",  fg: "var(--ds-brass-deep)" },
  { bg: "var(--ds-sage-tint)",   fg: "#4F5C42" },
  { bg: "var(--ds-dust-tint)",   fg: "#7A6234" },
  { bg: "var(--ds-paper-deep)",  fg: "var(--ds-ink-soft)" },
];

export function tintFor(name: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return TINTS[Math.abs(h) % TINTS.length];
}
