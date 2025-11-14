import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'standalone',
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
        unoptimized: true
    },
    allowedDevOrigins: [
        'https://vivakr.com', // 프로토콜 포함
        '*.vivakr.com',
        'http://vivakr.com',
        'https://kimbumjun.com',
        '*.kimbumjun.com',
        'https://vivabm.com',
        'https://bm.vivabm.com',
        'bm.vivabm.com',
        'https://kimbumjun.com',
        '*.kimbumjun.com',
        'https://kimbumjun.co.kr',
        '*.kimbumjun.co.kr',
        'https://writer.or.kr',
        '*.writer.or.kr',
        'https://text.or.kr',
        '*.text.or.kr',
        'https://buddham.co.kr',
        '*.buddham.co.kr',
        'https://code.vivabm.com',
        'https://code.vivakr.com',
        'https://code.kimbumjun.com',
        'https://code.kimbumjun.co.kr',
        'https://code.writer.or.kr',
        'https://code.text.or.kr',
        'https://api.vivakr.com',
        'http://localhost:47960',
        'http://localhost:3000', // 로컬 풀 URL
        'http://192.168.0.8:3000',
        'http://127.0.0.1:3000',
        'localhost',            // 기본
        '127.0.0.1',
        '::1',                 // IPv6
        '::ffff:',

    ],
    async redirects() {
        return [
            {
                source: '/blue-marble',
                destination: '/odds/marble',
                permanent: true
            },
            {
                source: '/games/marble',
                destination: '/odds/marble',
                permanent: true
            }
        ]
    }
};

const withMDX = createMDX({});

export default withMDX(nextConfig)
