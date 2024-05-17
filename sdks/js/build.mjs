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
  // entry: "src/index.ts",
  output: `${outputDir}/esm/index.d.ts`,
  outdir: `${outputDir}/esm`,
  tsc: `--extendedDiagnostics -p ./tsconfig.types.json`,
}).generate();

new pkg.Generator({
  // entryPoints: ["src/react/native/index.ts"],
  entry: "src/react/native/index.ts",
  output: `${outputDir}/rn/index.d.ts`,
  // outdir: `${outputDir}/rn`,
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

// cjs
// build({
//   ...sharedConfig,
//   platform: "node", // for CJS
//   // outfile: `${outputDir}/cjs/index.js`,
//   outdir: `${outputDir}/cjs/`,
// });

// esm
let result = await build({
  ...sharedConfig,
  // splitting: true,
  outfile: `${outputDir}/esm/index.mjs`,
  // outdir: `${outputDir}/esm`,
  platform: "neutral", // for ESM
  format: "esm",
  external: Object.keys(pj.dependencies).concat(
    Object.keys(pj.peerDependencies),
  ),
  // plugins: [nodeExternalsPlugin()],
});

// console.log(result);

fs.writeFileSync("meta.json", JSON.stringify(result.metafile));

console.log(
  await analyzeMetafile(result.metafile, {
    verbose: false,
  }),
);

let nativeResult = await build({
  ...sharedConfig,
  // splitting: true,
  entryPoints: ["src/react/native/index.ts"],
  outfile: `${outputDir}/rn/index.mjs`,
  // outdir: `${outputDir}/esm`,
  // platform: "neutral", // for ESM
  format: "esm",
  external: Object.keys(pj.dependencies).concat(
    Object.keys(pj.peerDependencies),
  ),
  plugins: [nodeExternalsPlugin("react-native")],
});

// console.log(result);

const packageContent = {
  name: "@sugar-ai/copilot-one-js/rn",
  private: true,
  types: "./rn/index.d.ts",
  main: "./rn/index.mjs",
  "jsnext:main": "./rn/index.mjs",
  module: "./rn/index.mjs",
};

fs.writeFileSync(
  `${outputDir}/rn/package.json`,
  JSON.stringify(packageContent, null, 2),
);

fs.writeFileSync("meta-native.json", JSON.stringify(nativeResult.metafile));

console.log(
  await analyzeMetafile(nativeResult.metafile, {
    verbose: false,
  }),
);

let jsBuildResult = await build({
  ...sharedConfig,
  entryPoints: ["src/js/index.js"],
  outfile: `${outputDir}/js/copilot-one.min.js`,
  bundle: true,
  minify: true,
  platform: "browser",
  format: "iife",
});

fs.writeFileSync("meta-js.json", JSON.stringify(jsBuildResult.metafile));

if (!fs.existsSync(typesPath)) {
  console.error(`Types are not generated: ${typesPath}`);
  process.exit(1); // Exit the script with an error code
}
