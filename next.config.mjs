import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': resolve(__dirname, 'lib/undici-stub.js')
      };
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ['gsap', 'lucide-react']
  }
}

export default nextConfig;