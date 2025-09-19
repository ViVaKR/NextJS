import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  turbopack: {},
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.vivakr.com',
        pathname: '/images/**',
      }
    ],

  },
  allowedDevOrigins: [
    'https://vivakr.com',
    '*.vivakr.com',
    'localhost',
    '127.0.0.1',
    '::1',
    '::ffff:',
  ]
};

export default nextConfig;
