/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@hello-pangea/dnd'],
  output: 'standalone',
}
 
module.exports = nextConfig 