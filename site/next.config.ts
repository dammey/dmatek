import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@dmatek/brand"],
  async redirects() {
    return [{ source: "/internet-ready-homes", destination: "/infrastructure/internet-ready-homes", permanent: true }];
  },
};

export default nextConfig;
