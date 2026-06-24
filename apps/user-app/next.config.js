/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/prisma", "@repo/store", "@repo/ui"]
};

export default nextConfig;
