"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggleButton } from '@/components/theme/ThemeToggleButton';

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
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 z-30 px-4 md:px-10 flex items-center justify-between bg-[var(--shell-header)] border-b border-[var(--shell-header-border)] transition-colors duration-200">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg md:text-[22px] font-bold text-[var(--foreground)]  leading-none mb-1">
          {meta.title}
        </h1>
        <p className="hidden lg:block text-[11px] text-[var(--shell-muted)] font-bold ">
          {meta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggleButton />

        <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-[var(--shell-success-bg)] border border-[var(--shell-success-border)]">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[var(--shell-success-dot)] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[9px] md:text-[11px] font-black text-[var(--shell-success-text)] ">
            Platform Healthy
          </span>
        </div>
      </div>
    </header>
  );
};
