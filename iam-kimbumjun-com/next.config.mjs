import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    images: {
        remotePatterns: [
            {
                protocol: 'https', // 프로토콜 (http 또는 https)
                hostname: 'api.vivabm.com', // 허용할 도메인 이름
                port: '', // 특정 포트가 있다면 지정 (없으면 생략)
                pathname: '/images/**', // 특정 경로 패턴만 허용하고 싶다면 지정 (예: /images/ 하위 모든 경로)
                search: '',
            },
            // 다른 외부 도메인이 있다면 여기에 추가하면 되네
            // {
            //   protocol: 'https',
            //   hostname: 'another.domain.com',
            // },
        ],
    },
};
const withMDX = createMDX({
    // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
