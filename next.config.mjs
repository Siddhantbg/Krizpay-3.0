import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: false,
    optimizePackageImports: ['gsap', 'lucide-react']
  },
  webpack: (config, { isServer }) => {
    // Disable caching temporarily to fix ENOENT cache error
    config.cache = false;
    
    // Fix for undici module parsing error
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
      };
      
      // Exclude undici from client bundle
      config.externals = config.externals || [];
      config.externals.push('undici');
      
      // Add alias to completely prevent undici import and use our stub
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': resolve(__dirname, 'lib/undici-stub.js')
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
    
    // Transpile GSAP for better compatibility
    config.module.rules.push({
      test: /node_modules\/gsap/,
      sideEffects: false
    });
    
    return config;
  },
  swcMinify: true,
};

export default nextConfig;