/* Build the upload layout for /design-sync.
 *
 * Output tree (./upload/):
 *   _ds_bundle.js       — IIFE, populates window.JarvisDS
 *   _ds_bundle.css      — compiled Tailwind
 *   styles.css          — thin entry (fonts + @import _ds_bundle.css)
 *   README.md           — conventions header + component index
 *   _vendor/react.*.js
 *   components/<group>/<Name>/<Name>.d.ts
 *   components/<group>/<Name>/<Name>.html
 *   components/<group>/<Name>/<Name>.prompt.md
 */

import { build } from "esbuild";
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT  = join(ROOT, "upload");

execSync(`rm -rf "${OUT}" && mkdir -p "${OUT}"`);

// ─── 1. IIFE bundle ─────────────────────────────────────────────
const shimReact = {
  name: "shim-react-globals",
  setup(b) {
    b.onResolve({ filter: /^react$/ }, () => ({ path: "react", namespace: "gbl" }));
    b.onResolve({ filter: /^react-dom$/ }, () => ({ path: "react-dom", namespace: "gbl" }));
    b.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ path: "jsx", namespace: "gbl" }));
    b.onLoad({ filter: /.*/, namespace: "gbl" }, (a) => {
      if (a.path === "react")     return { contents: "module.exports = window.React;",    loader: "js" };
      if (a.path === "react-dom") return { contents: "module.exports = window.ReactDOM;", loader: "js" };
      if (a.path === "jsx") {
        return {
          contents:
            "const R = window.React;\n" +
            "module.exports = { jsx: R.createElement, jsxs: R.createElement, jsxDEV: R.createElement, Fragment: R.Fragment };\n",
          loader: "js",
        };
      }
      return null;
    });
  },
};

await build({
  entryPoints: [join(ROOT, "src/index.ts")],
  bundle: true,
  format: "iife",
  globalName: "JarvisDS",
  target: "es2020",
  outfile: join(OUT, "_ds_bundle.js"),
  jsx: "automatic",
  minify: true,
  logLevel: "warning",
  plugins: [shimReact],
});

// ─── 2. CSS ─────────────────────────────────────────────────────
execSync(
  `./node_modules/.bin/tailwindcss -i ./src/styles/styles.css -o "${OUT}/_ds_bundle.css" --minify`,
  { cwd: ROOT, stdio: "inherit" }
);

writeFileSync(
  join(OUT, "styles.css"),
  `/* Jarvis DS — style entry loaded by the design agent's runtime.
 * Everything reachable via @import from here becomes the design closure. */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap");
@import "./_ds_bundle.css";
`
);

// ─── 3. Vendor React ───────────────────────────────────────────
mkdirSync(join(OUT, "_vendor"), { recursive: true });
for (const [name, url] of Object.entries({
  "react.production.min.js":     "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
  "react-dom.production.min.js": "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
})) {
  execSync(`curl -sSL "${url}" -o "${join(OUT, "_vendor", name)}"`, { stdio: "inherit" });
}

// ─── 4. Components ──────────────────────────────────────────────
const distDir = join(ROOT, "dist");
if (!existsSync(join(distDir, "components"))) {
  console.error("❌ dist/components/ missing — run `pnpm build:types` first.");
  process.exit(1);
}

/* Each preview is a small createElement expression string that the
 * generated HTML runs inline. React + ReactDOM + JarvisDS are all in
 * scope via the script tags above it in the file. */
const COMPONENTS = [
  { group: "atoms",     name: "Button",           preview: `e(JarvisDS.Button, { onClick: () => {} }, "Mark today's rep done")` },
  { group: "atoms",     name: "Tick",             preview: `e(JarvisDS.Tick, { size: 28 })` },
  { group: "atoms",     name: "Avatar",           preview: `e("div", { style: { display: "flex", gap: 12 } },
      e(JarvisDS.Avatar, { key: "1", name: "Arjun Iyer" }),
      e(JarvisDS.Avatar, { key: "2", name: "Jaanvi", status: "done" }),
      e(JarvisDS.Avatar, { key: "3", name: "Mike", status: "pending" }),
      e(JarvisDS.Avatar, { key: "4", name: "A", size: "lg", status: "missed" }))` },
  { group: "atoms",     name: "StatusDot",        preview: `e("div", { style: { display: "flex", gap: 16 } },
      e("span", { key: "1", style: { display: "inline-flex", alignItems: "center", gap: 6 } }, e(JarvisDS.StatusDot, { status: "done" }), " done"),
      e("span", { key: "2", style: { display: "inline-flex", alignItems: "center", gap: 6 } }, e(JarvisDS.StatusDot, { status: "pending" }), " pending"),
      e("span", { key: "3", style: { display: "inline-flex", alignItems: "center", gap: 6 } }, e(JarvisDS.StatusDot, { status: "missed" }), " missed"))` },
  { group: "atoms",     name: "StreakChip",       preview: `e("div", { style: { display: "flex", gap: 12, alignItems: "center" } },
      e(JarvisDS.StreakChip, { key: "1", kept: 12, missed: 2 }),
      e(JarvisDS.StreakChip, { key: "2", kept: 12, missed: 2, verbose: true }))` },
  { group: "molecules", name: "JarvisMessage",    preview: `e(JarvisDS.JarvisMessage, { eyebrow: "Good morning" },
      "Today's promise — ten minutes with the book. The circle awaits your tick.")` },
  { group: "molecules", name: "NudgeCard",        preview: `e(JarvisDS.NudgeCard, {
      habit: "Read 10 minutes",
      jarvisNote: "The book waits on the shelf. Ten minutes will do.",
      partners: ["Jaanvi", "Mike"], state: "open"
    })` },
  { group: "molecules", name: "HabitDayDot",      preview: `e("div", { style: { display: "flex", gap: 8 } },
      ["kept","kept","missed","kept","kept","today","future"].map((s, i) => e(JarvisDS.HabitDayDot, { key: i, state: s, label: "MTWTFSS"[i] })))` },
  { group: "molecules", name: "ChatBubble",       preview: `e("div", null,
      e(JarvisDS.ChatBubble, { key: "1", role: "jarvis" }, "Good evening, sir. What habit are you trying to build?"),
      e(JarvisDS.ChatBubble, { key: "2", role: "user"   }, "Read 30 minutes a day."),
      e(JarvisDS.ChatBubble, { key: "3", role: "jarvis" }, "Thirty is a fine target. May I suggest we start at ten?"))` },
  { group: "molecules", name: "ChoiceChipRow",    preview: `e(JarvisDS.ChoiceChipRow, {
      options: [{value:"daily",label:"Daily"},{value:"weekdays",label:"Weekdays"},{value:"custom",label:"Custom"}],
      value: "daily", onSelect: () => {}
    })` },
  { group: "molecules", name: "DotCalendar",      preview: `e(JarvisDS.DotCalendar, {
      days: ["kept","kept","missed","kept","kept","kept","kept","kept","kept","missed","kept","kept","kept","today"]
    })` },
  { group: "molecules", name: "RegisterSlider",   preview: `e(JarvisDS.RegisterSlider, { value: "neutral" })` },
  { group: "molecules", name: "DaySelector",      preview: `e(JarvisDS.DaySelector, { value: ["M","T","W","Th","F","Sa"] })` },
  { group: "molecules", name: "CircleMemberRow",  preview: `e(JarvisDS.CircleMemberRow, {
      name: "Jaanvi", status: "done", kept: 9, missed: 1, lastUpdate: "Just now"
    })` },
  { group: "molecules", name: "WitnessLine",      preview: `e(JarvisDS.WitnessLine, { partners: ["Jaanvi","Mike"] })` },
  { group: "molecules", name: "CircleCheers",     preview: `e(JarvisDS.CircleCheers, { notes: [
      {name:"Jaanvi", note:"noted your tick today."},
      {name:"Mike",   note:"saw the book is winning."}
    ] })` },
  { group: "organisms", name: "CheckInScreen",    preview: `e(JarvisDS.CheckInScreen, {
      greeting: "Good morning, sir. Day fourteen — and a quiet, unflashy one to begin.",
      habit: "Read 10 minutes",
      jarvisNote: "The book waits on the shelf. Ten minutes will do.",
      partners: ["Jaanvi", "Mike"], state: "open"
    })` },
  { group: "organisms", name: "GroupView",        preview: `e(JarvisDS.GroupView, {
      jarvisCopy: "The circle is gathered. Jaanvi has shown; Mike is yet to.",
      members: [
        { name: "Jaanvi", status: "done",    kept: 9,  missed: 1, lastUpdate: "Just now" },
        { name: "Mike",   status: "pending", kept: 11, missed: 3 },
        { name: "Arjun",  status: "pending", kept: 12, missed: 2, isSelf: true }
      ]
    })` },
  { group: "organisms", name: "OnboardingChat",   preview: `e(JarvisDS.OnboardingChat, {
      history: [
        { role: "jarvis", text: "Good evening, sir. Before we begin — what habit are you trying to build, or break?" }
      ],
      inputMode: "typed", inputValue: "", onInputChange: () => {}, onSend: () => {}
    })` },
  { group: "organisms", name: "MilestoneScreen",  preview: `e(JarvisDS.MilestoneScreen, {
      day: 21,
      identityLine: "You are no longer someone trying to read. You are a reader.",
      closingLine: "With respect, sir — the practice has done its quiet work.",
      cheers: [{ name: "Jaanvi", note: "saw twenty-one days." }, { name: "Mike", note: "noted the milestone." }]
    })` },
  { group: "organisms", name: "HabitDashboard",   preview: `e(JarvisDS.HabitDashboard, {
      habit: "Read 10 minutes",
      history: ["kept","kept","missed","kept","kept","kept","kept","kept","kept","missed","kept","kept","kept","today"],
      jarvisNote: "Twelve kept, two missed. The book is winning — quietly, but it is winning."
    })` },
];

const groupLabel = { atoms: "Atoms", molecules: "Molecules", organisms: "Organisms" };

const previewHtml = (name, group, previewExpr) => `<!-- @dsCard group="${groupLabel[group]}" -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=390, initial-scale=1" />
  <title>${name}</title>
  <link rel="stylesheet" href="../../../styles.css" />
  <style>
    html, body { margin: 0; }
    body { padding: 24px; background: var(--ds-paper); min-height: 100vh; font-family: var(--ds-font-sans); color: var(--ds-ink); }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="../../../_vendor/react.production.min.js"></script>
  <script src="../../../_vendor/react-dom.production.min.js"></script>
  <script src="../../../_ds_bundle.js"></script>
  <script>
    (function () {
      var e = React.createElement;
      var root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(${previewExpr});
    })();
  </script>
</body>
</html>
`;

const promptMd = (name, group, previewExpr) => `# ${name}

**Group:** ${groupLabel[group]}

The Jarvis: The Habit Guru DS — a mobile-only (~390px), muted-warm (paper / ink / brass) habit companion. Read \`/README.md\` before composing screens: it lists the voice, pillar, and hard NFR rules that apply to every component in this system.

## Preview

The live \`${name}.html\` preview renders this expression:

\`\`\`js
${previewExpr.trim()}
\`\`\`

## API

See \`${name}.d.ts\` for prop types. All props are strongly typed.

## Non-negotiables

- Never pair with red. There is no red in this system.
- Never render emoji inside props that take copy.
- Jarvis speaks in serif (via \`JarvisMessage\` or the \`ds-jarvis-quote\` class). ~70% formal, ~30% dry-witted. "Sir" used sparingly, no exclamations.
- Streaks always render as two numbers (kept · missed) — the \`StreakChip\` prop API enforces this.
- Missed days are always \`dust\` (warm tan). Never a red X, never a zeroed streak.
`;

function findDtsFor(name) {
  return [
    join(distDir, "components/atoms", `${name}.d.ts`),
    join(distDir, "components/molecules", `${name}.d.ts`),
    join(distDir, "components/organisms", `${name}.d.ts`),
  ].find(existsSync);
}

for (const { group, name, preview } of COMPONENTS) {
  const compDir = join(OUT, "components", group, name);
  mkdirSync(compDir, { recursive: true });

  const dts = findDtsFor(name);
  if (dts) copyFileSync(dts, join(compDir, `${name}.d.ts`));

  writeFileSync(join(compDir, `${name}.html`),      previewHtml(name, group, preview));
  writeFileSync(join(compDir, `${name}.prompt.md`), promptMd(name, group, preview));
}

// ─── 5. README ──────────────────────────────────────────────────
const conventions = readFileSync(join(ROOT, ".design-sync/conventions.md"), "utf8");
const index = ["atoms", "molecules", "organisms"]
  .map((g) => {
    const rows = COMPONENTS.filter((c) => c.group === g)
      .map((c) => `- \`${c.name}\` — \`components/${g}/${c.name}/\``)
      .join("\n");
    return `\n### ${groupLabel[g]}\n\n${rows}`;
  })
  .join("\n");
writeFileSync(join(OUT, "README.md"), `${conventions}\n\n---\n\n## Component index\n${index}\n`);

console.log(`\n  ✔ Upload tree ready at: ${OUT}`);
console.log(`    ${COMPONENTS.length} components, README + bundle + vendor.\n`);
