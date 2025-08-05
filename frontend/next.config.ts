import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Webpack configuration for proper alias resolution
  webpack: (config) => {
    // Add alias for @ symbol
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };

    return config;
  },
  // Ensure proper module resolution
  experimental: {
    typedRoutes: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
