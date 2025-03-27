import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  async serverOptions() {
    return {
      port: 2024,
    };
  },
};

export default nextConfig;
