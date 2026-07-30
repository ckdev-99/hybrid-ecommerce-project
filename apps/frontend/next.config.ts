import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disable optimization to avoid config issues
  },
};

export default nextConfig;
