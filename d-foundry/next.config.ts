import type { NextConfig } from "next";

// Deployed at https://vercel.com/dammey-s-projects/dfoundry — Root Directory: d-foundry.
const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@dmatek/brand"],
};

export default nextConfig;
