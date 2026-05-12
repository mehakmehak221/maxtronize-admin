import React from "react";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200`}
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('maxtronize-theme');document.documentElement.classList.toggle('dark',t!=='light');}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
        <StoreProvider>
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
