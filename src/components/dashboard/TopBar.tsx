"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Moon } from 'lucide-react';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Super Admin Panel',
    subtitle: 'Real-time metrics across all assets, issuers, and transactions',
  },
  '/assets': {
    title: 'Super Admin Panel',
    subtitle: 'Real-time metrics across all assets, issuers, and transactions',
  },
  '/users': {
    title: 'Super Admin Panel',
    subtitle: 'Real-time metrics across all assets, issuers, and transactions',
  },
  '/issuers': {
    title: 'Super Admin Panel',
    subtitle: 'Real-time metrics across all assets, issuers, and transactions',
  },
  '/rbac': {
    title: 'Super Admin Panel',
    subtitle: 'Real-time metrics across all assets, issuers, and transactions',
  },
  '/transactions': {
    title: 'Super Admin Panel',
    subtitle: 'Real-time metrics across all assets, issuers, and transactions',
  },
  '/compliance': {
    title: 'Super Admin Panel',
    subtitle: 'Real-time metrics across all assets, issuers, and transactions',
  },
  '/analytics': {
    title: 'Super Admin Panel',
    subtitle: 'Real-time metrics across all assets, issuers, and transactions',
  },
};

export const TopBar = () => {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  const meta = pageMeta[pathname] ?? pageMeta['/'];

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white border-b border-slate-100 z-30 px-4 md:px-10 flex items-center justify-between">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg md:text-[22px] font-bold text-slate-900 tracking-tight leading-none mb-1">
          {meta.title}
        </h1>
        <p className="hidden lg:block text-[11px] text-slate-400 font-bold tracking-tight">
          {meta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button className="hidden sm:flex items-center gap-2 px-4 md:px-5 py-2 rounded-full border border-slate-100 bg-white text-slate-900 transition-all shadow-sm">
          <Moon size={15} className="text-amber-400" fill="currentColor" />
          <span className="text-[12px] font-black tracking-tight">Dark Mode</span>
        </button>

        <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-[#D1FAE5] border border-[#A7F3D0]">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#10B981]" />
          <span className="text-[9px] md:text-[11px] font-black text-[#059669] tracking-tight">
            Platform Healthy
          </span>
        </div>
      </div>
    </header>
  );
};
