/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        // unoptimized: true,
        minimumCacheTTL: 60,
    },

};

export default nextConfig;
