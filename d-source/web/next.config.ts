import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@dmatek/brand"],
  // One store, one catalogue (v11): the old split-store URLs land on their new homes.
  async redirects() {
    return [
      { source: "/emporium", destination: "/shop", permanent: true },
      { source: "/emporium/:path*", destination: "/shop", permanent: true },
      { source: "/provision/:path+", destination: "/shop", permanent: true },
      { source: "/categories", destination: "/shop", permanent: true },
      { source: "/basket", destination: "/cart", permanent: true },
      { source: "/legal/:topic", destination: "/terms", permanent: true },
      { source: "/help/:topic", destination: "/help", permanent: true },
      { source: "/office-in-a-box", destination: "/provision", permanent: true },
      { source: "/site-survey", destination: "/provision#survey", permanent: true },
      { source: "/about", destination: "/", permanent: true },
    ];
  },
};

// Staff use the admin at source.dmatek.com/admin/<module>: proxied to the
// separate admin deployment (its basePath is /admin).
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN;
if (ADMIN_ORIGIN) {
  nextConfig.rewrites = async () => [
    { source: "/admin", destination: `${ADMIN_ORIGIN}/admin` },
    { source: "/admin/:path*", destination: `${ADMIN_ORIGIN}/admin/:path*` },
  ];
}

export default nextConfig;
