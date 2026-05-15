"use client";

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { ShellProvider } from "@/components/layout/ShellContext";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
 

  const isDetailView = /^\/(assets|users|issuers)\/[^/]+$/.test(pathname);

  if (isLoginPage) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  if (isDetailView) {
    return (
      <main className="min-h-screen bg-[var(--shell-main)] transition-colors duration-200">
        {children}
      </main>
    );
  }

  return (
    <ShellProvider>
      <Sidebar />
      <TopBar />
      <main className="lg:pl-64 pt-16 sm:pt-20 min-h-screen bg-[var(--shell-main)] transition-colors duration-200">
        {children}
      </main>
    </ShellProvider>
  );
}
