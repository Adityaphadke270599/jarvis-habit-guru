/* Build the standalone preview HTML used for visual sanity-checking.
 *
 * Inlines styles.css and preview.js into a single file because the
 * Launch preview panel serves only the file you point it at — not
 * adjacent assets. */

import { build } from "esbuild";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });

// 1. Tailwind → styles.css
execSync("./node_modules/.bin/tailwindcss -i ./src/styles/styles.css -o ./dist/styles.css", { stdio: "inherit" });

// 2. esbuild → preview.js (React bundled in, IIFE)
await build({
  entryPoints: ["src/dev/preview.tsx"],
  bundle: true,
  format: "iife",
  target: "es2020",
  outfile: "dist/preview.js",
  jsx: "automatic",
  sourcemap: false,
  loader: { ".svg": "text" },
  logLevel: "info",
});

// 3. Inline into a single self-contained HTML
const css = readFileSync("dist/styles.css", "utf8");
const js = readFileSync("dist/preview.js", "utf8");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Jarvis DS — Preview</title>
    <style>${css}</style>
    <style>
      body { margin: 0; }
      #boot { padding: 24px; font-family: system-ui; color: #2D2620; background: #F4EDE3; }
      #err { padding: 16px; background: #ffe7e0; color: #7a1f00; font-family: monospace; font-size: 12px; white-space: pre-wrap; display: none; }
    </style>
  </head>
  <body>
    <div id="boot">Loading Jarvis DS preview…</div>
    <pre id="err"></pre>
    <div id="root"></div>
    <script>
      window.addEventListener("error", (e) => {
        const el = document.getElementById("err");
        el.style.display = "block";
        el.textContent = "JS error: " + (e.error ? e.error.stack : e.message);
      });
    </script>
    <script>try{
${js}
}catch(e){var el=document.getElementById("err");el.style.display="block";el.textContent="JS error: "+(e&&e.stack?e.stack:String(e));}finally{var b=document.getElementById("boot");if(b)b.remove();}</script>
  </body>
</html>`;

writeFileSync("dist/preview.html", html);
console.log(`\n  → dist/preview.html (${(html.length / 1024).toFixed(0)} KB, self-contained)\n`);
