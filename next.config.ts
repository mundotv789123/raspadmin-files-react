import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
    },
  }
};

export default nextConfig;
