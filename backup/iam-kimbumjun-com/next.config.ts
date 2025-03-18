
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images: {

  //   domains: ['api.vivabm.com'], // 허용할 외부 도메인 추가
  // },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.vivabm.com', // image URL hostname
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
  // reactStrictMode: false
  /* config options here */
  // 프리로드 최소화 (필요 시 실험)
  // experimental: {
  //   optimizePackageImports: ['@mui/material'], // MUI 최적화

  // },
  // 캐싱 전략 강화
  // headers: async () => {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }, // 정적 리소스 캐싱
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
