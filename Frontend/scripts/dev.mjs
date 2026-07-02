import { context } from "esbuild";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });

const css = spawn(
  "npx",
  ["tailwindcss", "-i", "./src/styles/styles.css", "-o", "./dist/styles.css", "--watch"],
  { stdio: "inherit" }
);

const ctx = await context({
  entryPoints: ["src/dev/preview.tsx"],
  bundle: true,
  format: "esm",
  target: "es2020",
  outfile: "dist/preview.js",
  jsx: "automatic",
  sourcemap: true,
  loader: { ".svg": "text" },
  logLevel: "info",
});

await ctx.watch();
await ctx.serve({ servedir: "dist", port: 5173, host: "127.0.0.1" });

console.log("\n  Preview → http://127.0.0.1:5173/preview.html\n");

process.on("SIGINT", () => {
  css.kill();
  ctx.dispose().then(() => process.exit(0));
});
