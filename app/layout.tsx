// app/layout.tsx
import type { Metadata } from "next";
import { Azeret_Mono as Geist_Mono } from 'next/font/google';
import { Fredoka } from 'next/font/google';
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PokéSearch - Find Your Favorite Pokémon",
  description: "Search and discover information about your favorite Pokémon using PokéSearch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} ${geistMono.variable} antialiased min-h-screen bg-black`}
      >
        {children}
      </body>
    </html>
  );
}

