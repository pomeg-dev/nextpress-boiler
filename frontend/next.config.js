// @ts-check
/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // PRODUCTION OPTIMIZATIONS
  transpilePackages: ["@pomeg-dev/nextpress-client"],
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // PERFORMANCE OPTIMIZATIONS
  experimental: {
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
  
  // Next's own chunking and CSS minification are tuned for the App Router:
  // each client component loads only on the routes that render it. A custom
  // splitChunks config merged every client component into chunks that load on
  // every page.
  webpack(config) {
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
    // First match wins: AVIF is 20–30% smaller than WebP at the same quality.
    formats: ['image/avif', 'image/webp'],
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