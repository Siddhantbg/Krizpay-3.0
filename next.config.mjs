import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Use our stub instead of undici on the client
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': resolve(__dirname, 'lib/undici-stub.js')
      };
    }
    
    // Ignore the missing encoding module warning
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false
    };
    
    // Transpile GSAP for better compatibility
    config.module.rules.push({
      test: /node_modules\/gsap/,
      sideEffects: false
    });
    
    return config;
  },
  // Optimize chunking for better loading
  experimental: {
    optimizePackageImports: ['gsap', 'lucide-react']
  }
}

export default nextConfig;