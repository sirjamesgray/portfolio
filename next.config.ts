import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "knjugovolotmeulfhzte.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/protected-content",
        destination: "/protected",
        permanent: true,
      },
      {
        source: "/creative-portfolio",
        destination: "/protected",
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
