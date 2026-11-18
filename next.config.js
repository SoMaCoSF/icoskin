/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: the estate deploys byte-exact static files to Vercel.
  output: 'export',
};
module.exports = nextConfig;
