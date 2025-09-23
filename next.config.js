/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'example.com',
      'images.unsplash.com',
      'dotfloiygvhsujlwzqgv.supabase.co'
    ],
  },
}

module.exports = nextConfig
