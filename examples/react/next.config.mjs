/** @type {import('next').NextConfig} */
import path from "path";
import fs from "fs";

// const nextConfig = {};

const additionalPaths = [
  path.resolve("node_modules/@sugar-ai/core"),
  path.resolve("../../sdks/core/dist/esm/"),
  path.resolve("node_modules/@sugar-ai/copilot-one-js"),
  path.resolve("../../sdks/js/dist/esm/"),
];

// const nextConfig = {
//   webpack: (config, { dev }) => {
//     if (dev) {

//       console.log(additionalPaths);
//       console.log(config.module.rules);
//       console.log(config.watchOptions);
//       // Add additional directories to Webpack's watch list
//       additionalPaths.forEach((dir) => {
//         fs.readdirSync(dir).forEach((file) => {
//           config.module.rules.push({
//             test: path.resolve(dir, file),
//             loader: "ignore-loader",
//           });
//         });
//       });
//     }
//     return config;
//   },
// };

const nextConfig = {
  distDir: process.env.NODE_ENV === "development" ? "dist" : ".next",
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Add additional directories to Webpack's watch list
      //   config.watchOptions = {
      //     ...config.watchOptions,
      //     ignored: /node_modules/,
      //     aggregateTimeout: 300,
      //     poll: 1000,
      //   };

      config.module.rules.push({
        test: /\.jsx?$/,
        include: additionalPaths,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["next/babel"],
          },
        },
      });
    }

    return config;
  },
};

export default nextConfig;
