import * as esbuild from "esbuild";
import pkg from "npm-dts";
import pj from "./package.json" assert { type: "json" };

// Generate type definitions before bundling
new pkg.Generator({
  entry: "src/index.ts",
  output: "dist/types/index.d.ts",
}).generate();

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  outfile: "dist/esm/index.mjs",
  // outdir: 'dist',
  outExtension: { ".js": ".mjs" },
  format: "esm",

  write: true,

  // optimisation
  // minify: true, // Consider enabling minification for production

  bundle: true,
  external: [
    ...Object.keys(pj.dependencies),
    ...Object.keys(pj.peerDependencies),
  ],
};

const ctx = await esbuild.context({
  ...sharedConfig,
  platform: "neutral",
  // plugins: [envPlugin], // Uncomment if using environment-specific plugins
});

await ctx.watch();
// console.log("watching...");

// await new Promise((r) => setTimeout(r, 10 * 1000));
// await ctx.dispose();
// console.log("stopped watching");
