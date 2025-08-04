/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RPC_URL: process.env.RPC_URL,
    PROGRAM_ID: process.env.PROGRAM_ID,
    SOLANA_ENV: process.env.SOLANA_ENV,
    COMMITMENT: process.env.COMMITMENT,
    WS_URL: process.env.WS_URL,
  },
  
  trailingSlash: false,

  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  
  transpilePackages: [
    '@solana/web3.js',
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets'
  ],
}

module.exports = nextConfig 