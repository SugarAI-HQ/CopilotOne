import { defineConfig } from "tsup";

// export default defineConfig();

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

    outExtension({ format }) {
      return {
        js: `.mjs`,
      };
    },
  };
});
