import { build } from "esbuild";
import { mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  target: "es2020",
  outfile: "dist/index.js",
  jsx: "automatic",
  sourcemap: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  loader: { ".svg": "text" },
  logLevel: "info",
});
