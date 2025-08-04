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

  webpack: (config, { isServer }) => {
    // Ignore specific modules that cause build issues
    config.ignoreWarnings = [
      { module: /node_modules\/@solana/ },
      { file: /node_modules\/@solana/ },
    ];
    
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
    
    // Handle ES modules properly
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    
    // Simple optimization to prevent module resolution issues
    if (config.optimization) {
      config.optimization.moduleIds = 'deterministic';
    }
    
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