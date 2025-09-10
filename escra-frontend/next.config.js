/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@hello-pangea/dnd'],
  output: 'standalone',
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
}
 
module.exports = nextConfig 