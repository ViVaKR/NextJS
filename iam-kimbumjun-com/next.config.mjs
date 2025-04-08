import createMDX from '@next/mdx'
// import remarkGfm from 'remark-gfm';           // GFM 지원
// import remarkRehype from 'remark-rehype';     // remark -> rehype 변환
// import rehypeStringify from 'rehype-stringify'; // HTML 출력

/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.vivabm.com',
                pathname: '/images/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com'
            },
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com'
            },
            {
                protocol: 'https',
                hostname: 'platform-lookaside.fbsbx.com'
            },
            {
                protocol: 'https',
                hostname: 'graph.microsoft.com', // Microsoft Graph 프로필 사진
            },
            {
                protocol: 'https',
                hostname: 'appleid.apple.com',
            },
        ],
    },
    allowedDevOrigins: [
        'http://viv.vivabm.com', // 프로토콜 포함
        'viv.vivabm.com',       // 기본
        'http://localhost:3000', // 로컬 풀 URL
        'localhost',            // 기본
        '127.0.0.1',
    ],
};

const withMDX = createMDX({
    // options: {
    //     remarkPlugins: [remarkGfm, remarkRehype], // remark-parse 대신 remark-gfm 사용
    //     rehypePlugins: [rehypeStringify],
    // },
});
export default withMDX(nextConfig);
