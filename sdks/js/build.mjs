// const { build } = require("esbuild");
// const { dependencies, peerDependencies } = require("./package.json");
// const { Generator } = require("npm-dts");
import { build, analyzeMetafile } from "esbuild";
import pkg from "npm-dts";
import pj from "./package.json" assert { type: "json" };
import fs from "node:fs";

const outputDir = `dist`;

new pkg.Generator({
  entry: "src/index.ts",
  output: `${outputDir}/types/index.d.ts`,
  tsc: "--extendedDiagnostics -p ./tsconfig.esm.json",
}).generate();

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,

  // size optimizations
  // minify: true,
  metafile: true,
  treeShaking: true,
  // nativeZip: true, // bundle as a single file

  // Sourcemaps
  sourcemap: true,

  // Remove unsued code
  drop: ["debugger"],
  dropLabels: ["DEV", "TEST"],

  // External dependencies
  external: Object.keys(pj.dependencies).concat(
    Object.keys(pj.peerDependencies),
  ),
};

build({
  ...sharedConfig,
  platform: "node", // for CJS
  outfile: `${outputDir}/cjs/index.cjs`,
});

let result = await build({
  ...sharedConfig,
  outfile: `${outputDir}/esm/index.mjs`,
  platform: "neutral", // for ESM
  format: "esm",
});

// console.log(result);

fs.writeFileSync("meta.json", JSON.stringify(result.metafile));

console.log(
  await analyzeMetafile(result.metafile, {
    verbose: false,
  }),
);
