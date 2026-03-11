import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@gfm-heart/components"],
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "node_modules")],
  },
  turbopack: {},
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      include: [path.resolve(process.cwd(), "node_modules/@gfm-heart/icons")],
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
