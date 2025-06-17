/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    // Disable caching temporarily to fix ENOENT cache error
    config.cache = false;
    
    // Fix for undici module parsing error and Firebase compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
        events: false,
        encoding: false,
        // Add these for Firebase compatibility
        'node-fetch': false,
        'whatwg-fetch': false,
      };
      
      // Exclude problematic modules from client bundle
      config.externals = config.externals || [];
      config.externals.push('undici', 'encoding', 'node-fetch');
      
      // Add alias to completely prevent problematic imports
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': false,
        'encoding': false,
        'node-fetch': false,
      };
    }
    
    // Add rule for handling ES modules
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
    
    // Ignore node-fetch warnings
    config.ignoreWarnings = [
      { module: /node-fetch/ },
      { file: /node_modules\/node-fetch/ },
    ];
    
    return config;
  },
  swcMinify: true,
  
  // Additional configuration for better compatibility
  transpilePackages: ['firebase'],
};

module.exports = nextConfig;