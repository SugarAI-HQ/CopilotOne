// const { build } = require("esbuild");
// const { dependencies, peerDependencies } = require("./package.json");
// const { Generator } = require("npm-dts");
import { build, analyzeMetafile } from "esbuild";
import pkg from "npm-dts";
import pj from "./package.json" assert { type: "json" };
import fs from "node:fs";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const outputDir = `dist`;
const typesPath = `${outputDir}/esm/index.d.ts`;

new pkg.Generator({
  entryPoints: ["src/**/*.ts", "src/*.ts"],
  // entryPoints: ["src/react/native/index.ts"],
  // entry: "src/react/native/index.ts",
  output: `${outputDir}/rn/index.d.ts`,
  outdir: `${outputDir}/rn`,
  tsc: `--extendedDiagnostics -p ./tsconfig.types.json`,
}).generate();

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,

  // size optimizations
  minify: true,
  metafile: true,
  treeShaking: true,
  // nativeZip: true, // bundle as a single file

  // Sourcemaps
  sourcemap: true,

  // Remove unsued code
  drop: ["debugger"],
  dropLabels: ["DEV", "TEST"],

  // External dependencies
};

let nativeResult = await build({
  ...sharedConfig,
  // splitting: true,
  // entryPoints: ["src/react/native/index.ts"],
  outfile: `${outputDir}/rn/index.mjs`,
  // outdir: `${outputDir}/esm`,
  // platform: "neutral", // for ESM
  format: "esm",
  external: Object.keys(pj.dependencies).concat(
    Object.keys(pj.peerDependencies),
  ),
  plugins: [nodeExternalsPlugin("react-native")],
});

fs.writeFileSync("meta-native.json", JSON.stringify(nativeResult.metafile));

console.log(
  await analyzeMetafile(nativeResult.metafile, {
    verbose: false,
  }),
);
