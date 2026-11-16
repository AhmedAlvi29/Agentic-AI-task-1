import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "gsap"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
