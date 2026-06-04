import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: '/home/dnx-xy/Developments/Cafe-R/workspace/frontend',
  },
  allowedDevOrigins: [
    '192.168.101.2',
    '192.168.101.4',
    '192.168.101.15',
  ],
};

export default nextConfig;
