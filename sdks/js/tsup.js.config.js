import { defineConfig } from "tsup";
import { rename } from "fs/promises";
import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";

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
    // drop: ["debugger"],
    // dropLabels: ["DEV", "TEST"],

    esbuildOptions(options, context) {
      return {
        ...options,
        drop: ["debugger"],
        dropLabels: ["DEV", "TEST"],
      };
    },

    async onSuccess() {
      try {
        // Always do it
        await rename("dist/js/index.global.js", "dist/js/copilot-one.min.js");
        console.log("Output file successfully renamed");

        // Serve the js file
        const certDir = "certs/";
        const certFile = path.join(certDir, "fullchain.pem");
        const keyFile = path.join(certDir, "privkey.pem");
        const port = 443;

        // Start the live-server
        if (
          options.watch &&
          fs.existsSync(certFile) &&
          fs.existsSync(keyFile)
        ) {
          try {
            const output = execSync(`lsof -nP -i :${port} | grep "LISTEN"`)
              .toString()
              .trim();
            if (output) {
              // console.log(`Port ${port} is already in use. \n ${output}.`);
            }
          } catch (error) {
            console.log(`Port ${port} is free. Starting HTTPS server.`);
            exec(
              // "npx live-server --port=8080 --watch=dist/js",
              `npx http-server dist/js --cors -p ${port} --ssl --cert ${certFile} --key ${keyFile}`,
              (error, stdout, stderr) => {
                console.log(
                  "Serving https://local.sugarai.dev/copilot-one.min.js",
                );
                if (error) {
                  console.error(`Error starting server: ${error.message}`);
                  return;
                }
                if (stderr) {
                  console.error(`Server stderr: ${stderr}`);
                }
              },
            );
          }
        }
      } catch (error) {
        console.error("Error renaming output file:", error);
      }
    },
  };
});
