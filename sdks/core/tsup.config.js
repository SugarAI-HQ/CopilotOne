import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/index.ts"],
    outDir: "dist/esm",
    splitting: false,
    sourcemap: true,
    treeshake: true,

    clean: true,
    minify: !options.watch,

    format: ["esm"],

    dts: true,

    metafile: true,

    drop: ["debugger"],
    dropLabels: ["DEV", "TEST"],

    outExtension({ format }) {
      return {
        js: `.mjs`,
      };
    },
  };
});
