import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm';           // GFM 지원
import remarkRehype from 'remark-rehype';     // remark -> rehype 변환
import rehypeStringify from 'rehype-stringify'; // HTML 출력

/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'standalone',
    turbopack: {},
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.vivakr.com',
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
        'https://vivakr.com', // 프로토콜 포함
        'http://vivakr.com',
        'https://kimbumjun.com',
        'https://kimbumjun.co.kr',
        'https://writer.or.kr',
        'https://text.or.kr',
        'https://buddham.co.kr',
        'https://vivabm.com',
        'http://localhost:47960',
        'http://localhost:3000', // 로컬 풀 URL
        'http://192.168.0.8:3000',
        'localhost',            // 기본
        '127.0.0.1',
        '::1',                 // IPv6
        '::ffff:',
    ]
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [remarkGfm, remarkRehype], // remark-parse 대신 remark-gfm 사용
        rehypePlugins: [rehypeStringify],
    },
});

export default withMDX(nextConfig)
// export default nextConfig;
