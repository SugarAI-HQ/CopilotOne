import * as esbuild from "esbuild";
import pkg from "npm-dts";
import pj from "./package.json" assert { type: "json" };
import { exec } from "child_process";

// Generate type definitions before bundling
new pkg.Generator({
  entry: "src/index.ts",
  output: "dist/types/index.d.ts",
}).generate();

const sharedConfig = {
  // entryPoints: ["src/index.ts"],
  entryPoints: ["src/react/native/index.ts"],
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

  // watch: {
  //   // onRebuildStart({ changes }) {
  //   //   console.log("Files that triggered rebuild:", changes);
  //   // },
  //   // onRebuild(error, result) {
  //   //   if (err != null) {
  //   //     console.error("build failed:", error);
  //   //   } else {
  //   //     console.log("build succeeded:", result);
  //   //   }
  //   // },
  // },
};

const ctx = await esbuild.context({
  ...sharedConfig,
  platform: "neutral",
  // plugins: [envPlugin], // Uncomment if using environment-specific plugins
});

await ctx.watch();
// console.log("watching...");

await new Promise((r) => {
  const cmd = `yalc publish --push --changed  --no-scripts  --sig`;

  setInterval(function () {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        // console.error(`Command stderr: ${stderr}`);
        return;
      }
      console.log(`Command stdout: ${stdout}`);
    });
  }, 3 * 1000);
});
// await ctx.dispose();
// console.log("stopped watching");
