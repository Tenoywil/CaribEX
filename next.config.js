/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  output: 'standalone',
  experimental: {
    // Enable experimental features if needed
  },
}

module.exports = nextConfig
