/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
  
  transpilePackages: [
    '@solana/web3.js',
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets'
  ],
}

module.exports = nextConfig 