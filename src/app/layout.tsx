import React from "react";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maxtronize Admin | Premium Dashboard",
  description: "Advanced analytics and management for Maxtronize.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-[#F8FAFC]`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
