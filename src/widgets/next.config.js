/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nitrostack/widgets'],

  // Static export for production builds (NitroStudio reads from out/)
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    distDir: 'out',
    images: {
      unoptimized: true,
    },
  }),

  // Development optimizations
  ...(process.env.NODE_ENV !== 'production' && {
    webpack: (config, { isServer }) => {
      if (config.cache && config.cache.type === 'filesystem') {
        config.cache = { type: 'memory' };
      }
      if (!isServer) {
        config.cache = false;
      }
      return config;
    },
    devIndicators: {
      buildActivity: false,
    },
    compress: false,
  }),
};

module.exports = nextConfig;
