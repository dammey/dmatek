import type { NextConfig } from "next";

// Every module lives at /admin/<id> (ids as in "DSource Admin v3.dc.html").
// The storefront proxies source.dmatek.com/admin/* here, so the admin sits
// under the store's domain while staying a separate deployment.
const OLD: [string, string][] = [
  ["dashboard", "dash"],
  ["installations", "schedule"],
  ["categories", "cats"],
  ["notifications", "notify"],
  ["staff", "roles"],
];

const nextConfig: NextConfig = {
  agentRules: false,
  basePath: "/admin",
  transpilePackages: ["@dmatek/brand"],
  async redirects() {
    return [
      { source: "/", destination: "/admin/dash", basePath: false, permanent: false },
      ...OLD.map(([from, to]) => ({ source: `/${from}`, destination: `/${to}`, permanent: true })),
    ];
  },
};

export default nextConfig;
