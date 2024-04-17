/** @type {import('next').NextConfig} */

const cspHeader = `
    frame-ancestors 'self' https://app.safe.global;
    upgrade-insecure-requests;
`;
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  headers: () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: "*",
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "X-Requested-With, content-type, Authorization",
        },
        {
          key: "Content-Security-Policy",
          value: cspHeader.replace(/\n/g, ""),
        },
      ],
    },
  ],
};

module.exports = nextConfig;
