"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { ShellProvider } from "@/components/layout/ShellContext";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("maxtronize-admin-token");
    if (!token && !isLoginPage) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  if (!authorized) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #2D1B69 0%, #0F172B 60%, #080C14 100%)',
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" />
          <span className="text-slate-400 text-xs font-bold font-mono tracking-wider uppercase">Loading Security Shell...</span>
        </div>
      </div>
    );
  }

  const isDetailView = /^\/(assets|users|issuers)\/[^/]+$/.test(pathname);

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
