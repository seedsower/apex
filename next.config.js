/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RPC_URL: process.env.RPC_URL,
    PROGRAM_ID: process.env.PROGRAM_ID,
    SOLANA_ENV: process.env.SOLANA_ENV,
    COMMITMENT: process.env.COMMITMENT,
    WS_URL: process.env.WS_URL,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        http2: false,
        zlib: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url'),
        util: require.resolve('util'),
        // Node.js modules that shouldn't be included in browser bundle
        'node-cache': false,
        'gill': false,
        '@triton-one/yellowstone-grpc': false,
        '@openbook-dex/openbook-v2': false,
        '@grpc/grpc-js': false,
      };
    }
    
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    
    return config;
  },
  transpilePackages: ['@solana/web3.js'],
}

module.exports = nextConfig 