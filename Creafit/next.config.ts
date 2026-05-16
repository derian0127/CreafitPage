import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'zyuaiimeuepkrtnchoxd.supabase.co',
      },
    ],
  },
  allowedDevOrigins: ['192.168.110.137'],
};

export default nextConfig;
