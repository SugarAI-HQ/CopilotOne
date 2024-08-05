/** @type {import('next').NextConfig} */
import path from "path";

const localPackagesEnabled = false;

const additionalPaths = [
  path.resolve("node_modules/@sugar-ai/core"),
  path.resolve("../../sdks/core/dist/esm/"),
  // path.resolve("node_modules/@sugar-ai/copilot-one-js"),
  // path.resolve("../../sdks/js/dist/esm/"),
];

const nextConfig = {
  distDir: process.env.NODE_ENV === "development" ? "dist" : ".next",
  webpack: (config, { dev, isServer }) => {
    if (dev && localPackagesEnabled) {
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
