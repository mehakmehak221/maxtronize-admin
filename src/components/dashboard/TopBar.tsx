"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { useShell } from "@/components/layout/ShellContext";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Super Admin Panel",
    subtitle:
      "Real-time metrics across all assets, issuers, and transactions",
  },
  "/assets": {
    title: "Super Admin Panel",
    subtitle:
      "Real-time metrics across all assets, issuers, and transactions",
  },
  "/users": {
    title: "Super Admin Panel",
    subtitle:
      "Real-time metrics across all assets, issuers, and transactions",
  },
  "/issuers": {
    title: "Super Admin Panel",
    subtitle:
      "Real-time metrics across all assets, issuers, and transactions",
  },
  "/rbac": {
    title: "Super Admin Panel",
    subtitle:
      "Real-time metrics across all assets, issuers, and transactions",
  },
  "/transactions": {
    title: "Super Admin Panel",
    subtitle:
      "Real-time metrics across all assets, issuers, and transactions",
  },
  "/compliance": {
    title: "Super Admin Panel",
    subtitle:
      "Real-time metrics across all assets, issuers, and transactions",
  },
  "/analytics": {
    title: "Super Admin Panel",
    subtitle:
      "Real-time metrics across all assets, issuers, and transactions",
  },
};

export const TopBar = () => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useShell();

  if (pathname === "/login") return null;

  const meta = pageMeta[pathname] ?? pageMeta["/"];

  return (
    <header
      className={`fixed top-0 right-0 left-0 lg:left-64 h-16 sm:h-20 px-3 sm:px-6 md:px-10 flex items-center justify-between gap-2 sm:gap-4 bg-[var(--shell-header)] border-b border-[var(--shell-header-border)] transition-colors duration-200 ${
        sidebarOpen ? "z-[60]" : "z-40"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden shrink-0 p-2 rounded-xl border border-[var(--shell-mobile-btn-border)] bg-[var(--shell-mobile-btn)] text-[var(--foreground)] shadow-sm hover:opacity-90 transition-opacity"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-sm sm:text-lg md:text-[22px] font-bold text-[var(--foreground)] leading-tight truncate">
            {meta.title}
          </h1>
          <p className="hidden md:block text-[10px] lg:text-[11px] text-[var(--shell-muted)] font-bold truncate mt-0.5">
            {meta.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        <ThemeToggleButton hideLabelOnMobile />

        <div
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--shell-success-bg)] border border-[var(--shell-success-border)]"
          title="Platform Healthy"
        >
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--shell-success-dot)] shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0" />
          <span className="hidden sm:inline text-[9px] md:text-[11px] font-black text-[var(--shell-success-text)] whitespace-nowrap">
            Platform Healthy
          </span>
        </div>
      </div>
    </header>
  );
};
