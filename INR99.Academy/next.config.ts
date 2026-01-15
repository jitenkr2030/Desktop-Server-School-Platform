import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure proper static file serving on Vercel
  trailingSlash: false,
  // Optimize for Vercel deployment
  images: {
    unoptimized: false,
  },
  // Compiler options to optimize CSS
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Enable standalone output for optimized production deployment
  output: 'standalone',
};

export default nextConfig;
