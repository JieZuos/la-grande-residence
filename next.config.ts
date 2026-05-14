/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    API_URL: "https://lagranderesidence.com/app/api", // change per environment
  },
};

module.exports = nextConfig;
