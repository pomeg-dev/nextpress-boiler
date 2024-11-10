// @ts-check

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ["./src"], // Adjust this path to match your project structure
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
        hostname: "wp.*.astlb.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

module.exports = nextConfig;
