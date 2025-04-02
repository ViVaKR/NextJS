import createMDX from '@next/mdx'

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
};
const withMDX = createMDX({
    // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
