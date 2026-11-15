import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A second build folder lets a preview build run without touching the one being served.
  distDir: process.env.NEXT_DIST || '.next',
  // Busy build machines (Nov 15) pushed a few tool pages past the default 60 s; they build in seconds normally.
  staticPageGenerationTimeout: 180,
  /* config options here */
  cacheComponents: true,
  poweredByHeader: false,
  partialPrefetching: true,
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
