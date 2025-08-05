/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

const nextConfig = {
  trailingSlash: false,
  output: 'export',
  distDir: 'out',
  basePath: (isProd && isGitHubPages) ? '/apex' : '',
  assetPrefix: (isProd && isGitHubPages) ? '/apex' : '',
  images: {
    unoptimized: true
  },
  
  transpilePackages: [
    '@solana/web3.js',
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets'
  ],
  
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      buffer: false,
      process: false,
    };
    return config;
  },
}

module.exports = nextConfig 