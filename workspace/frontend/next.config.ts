import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: [
    '192.168.101.4',
    '192.168.101.15',
    '*',
  ],
};

export default nextConfig;
