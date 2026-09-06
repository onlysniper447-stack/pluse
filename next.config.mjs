const isGhPages = process.env.GITHUB_PAGES === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(isGhPages
    ? {
        output: 'export',
        trailingSlash: true,
        basePath: '/pluse',
        assetPrefix: '/pluse',
      }
    : {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                {
                  key: 'Content-Security-Policy-Report-Only',
                  value:
                    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://api.infra.testnet.somnia.network wss://api.infra.testnet.somnia.network https://api.infra.mainnet.somnia.network wss://api.infra.mainnet.somnia.network https://rpc.somnia.network wss://api.pluse.xyz https://api.pluse.xyz",
                },
              ],
            },
          ]
        },
      }),
}

export default nextConfig
