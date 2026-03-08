import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediaKit - Video & Image Tools",
  description: "Compress videos, resize images for social media, and manage your media assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en" data-theme="mediakit">
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
