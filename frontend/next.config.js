// @ts-check
/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // PRODUCTION OPTIMIZATIONS
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // PERFORMANCE OPTIMIZATIONS
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap', '@react-three/fiber'],
    cssChunking: true,
    webpackBuildWorker: true,
  },
  
  // BUNDLE OPTIMIZATION
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  async rewrites() {
    return [
      // Main sitemap
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap-proxy/sitemap_index.xml',
      },
      // Catch-all for any XML file (this will handle all sitemap variations)
      {
        source: '/:path*.xml',
        destination: '/api/sitemap-proxy/:path*.xml',
      },
    ]
  },
  
  webpack(config, { dev, isServer }) {
    // CSS optimization for production
    if (!dev && !isServer) {
      // Enable CSS minification
      const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
      
      if (!config.optimization.minimizer) {
        config.optimization.minimizer = [];
      }
      
      config.optimization.minimizer.push(
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                colormin: true,
                convertValues: true,
                discardDuplicates: true,
                discardEmpty: true,
                discardOverridden: true,
                discardUnused: true,
                mergeIdents: false,
                mergeRules: true,
                minifyFontValues: true,
                minifyParams: true,
                minifySelectors: true,
                normalizeCharset: true,
                normalizeDisplayValues: true,
                normalizePositions: true,
                normalizeRepeatStyle: true,
                normalizeTimingFunctions: true,
                normalizeUnicode: true,
                normalizeUrl: true,
                orderedValues: true,
                reduceIdents: false,
                reduceInitial: true,
                reduceTransforms: true,
                svgo: true,
                uniqueSelectors: true,
              },
            ],
          },
        })
      );

      // Optimize CSS extraction
      const MiniCssExtractPlugin = config.plugins.find(
        plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
      );
      if (MiniCssExtractPlugin) {
        MiniCssExtractPlugin.options.ignoreOrder = true;
      }

      // Enable CSS and JavaScript code splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // CSS splitting
            styles: {
              name: 'styles',
              test: /\.(css|scss)$/,
              chunks: 'async',
              enforce: true,
              priority: 10,
            },
            // Heavy animation libraries - defer loading
            animations: {
              name: 'animations',
              test: /[\\/]node_modules[\\/](framer-motion|gsap|swiper)[\\/]/,
              chunks: 'async',
              priority: 20,
              minChunks: 2,
              minSize: 20000,
            },
            // Form libraries - defer loading
            forms: {
              name: 'forms',
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform)[\\/]/,
              chunks: 'async',
              priority: 15,
              minChunks: 2,
              minSize: 20000,
            },
            // Large UI libraries - defer loading
            ui: {
              name: 'ui-libs',
              test: /[\\/]node_modules[\\/](leaflet|three|@react-three)[\\/]/,
              chunks: 'async',
              priority: 15,
              minChunks: 2,
              minSize: 20000,
            },
            // Theme blocks - split by block type
            defaultBlocks: {
              name: 'default-blocks',
              test: /[\\/]themes[\\/]default[\\/]blocks[\\/]/,
              chunks: 'async',
              priority: 25,
              maxAsyncRequests: 10,
              maxInitialRequests: 5,
            },
            // Core WordPress blocks
            coreBlocks: {
              name: 'core-blocks',
              test: /[\\/]src[\\/]ui[\\/]wordpress[\\/]blocks[\\/]/,
              chunks: 'async',
              priority: 24,
            },
            // Component organisms (heavy components)
            organisms: {
              name: 'organisms',
              test: /[\\/]ui[\\/]components[\\/]organisms[\\/]/,
              chunks: 'async',
              priority: 23,
            },
          },
        },
      };
    }

    // SVG optimization
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "removeAttrs",
                  params: {
                    attrs: "(stroke|fill)",
                  },
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
  trailingSlash: true,
  reactStrictMode: true,
  sassOptions: {
    includePaths: ["./src"],
  },
  images: {
    deviceSizes: [320, 390, 640, 720, 1080, 1440, 1720, 2000],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 2678400,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-global.website-files.com",
      },
      {
        protocol: "https",
        hostname: "100k-faces.glitch.me",
      },
      {
        protocol: "https",
        hostname: "wp.*.pomeg.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);