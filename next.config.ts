import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.pokemondb.net',
        port: '', // ถ้าไม่มี port ระบุให้ใส่เป็นค่าว่าง
        pathname: '/**', // อนุญาตทุก path ภายใต้ hostname นี้
      },
    ],
  },
};

export default nextConfig;
