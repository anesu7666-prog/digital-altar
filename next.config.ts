/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "@supabase/supabase-js"],
  },
};

export default nextConfig;
