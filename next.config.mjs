/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  experimental: {
    typedRoutes: true,
    reactRefresh: false, // tắt Fast Refresh => tắt cả error overlay
  },
};

export default nextConfig;
