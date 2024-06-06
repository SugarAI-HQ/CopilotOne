import { defineConfig } from "tsup";
// import { exec } from "child_process";
import { rename } from "fs/promises";

export default defineConfig((options) => {
  return {
    entry: ["src/js/index.js"],
    outDir: "dist/js",
    outfile: "dist/js/copilot-one.min.js",
    splitting: false,
    sourcemap: true,
    treeshake: true,
    bundle: true,

    clean: false,
    minify: !options.watch,

    format: ["iife"],
    platform: "browser",

    dts: true,

    metafile: true,

    drop: ["debugger"],
    dropLabels: ["DEV", "TEST"],

    // outExtension({ format }) {
    //   return {
    //     js: `.mjs`,
    //   };
    // },

    async onSuccess() {
      try {
        await rename("dist/js/index.global.js", "dist/js/copilot-one.min.js"); // rename the output file
        console.log("Output file successfully renamed");
      } catch (error) {
        console.error("Error renaming output file:", error);
      }
    },

    // async onSuccess() {
    //   // Start some long running task
    //   // Like a server

    //   const cmd = `yalc publish --push --changed  --no-scripts  --sig`;
    //   console.log("publishing");
    //   exec(cmd, (error, stdout, stderr) => {
    //     console.log(stdout);
    //     if (error) {
    //       console.error(`Error executing command: ${error.message}`);
    //       return;
    //     }
    //     if (stderr) {
    //       console.error(`Command stderr: ${stderr}`);
    //       return;
    //     }
    //   });
    //
    // },
  };
});
