/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // prevent client bundle from trying to resolve Prisma
      config.resolve.alias['@prisma/client'] = false
      config.resolve.alias['.prisma/client/index-browser'] = false
      config.resolve.alias['.prisma/client'] = false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@prisma/client': false,
        '.prisma/client': false
      }
    }
    return config
  },
  experimental: { externalDir: true }
}
export default nextConfig
