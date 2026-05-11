"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

type Props = {
  
  compact?: boolean;
  className?: string;
};

export function ThemeToggleButton({ compact = false, className = "" }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[var(--shell-toggle-border)] bg-[var(--shell-toggle-bg)] text-[var(--shell-toggle-fg)] transition-all hover:opacity-90 shrink-0 ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <Sun size={15} className="text-amber-400" strokeWidth={2.25} />
          <span className="text-[11px] sm:text-[12px] font-black  whitespace-nowrap">
            {compact ? "Light" : "Light Mode"}
          </span>
        </>
      ) : (
        <>
          <Moon size={15} className="text-indigo-500" strokeWidth={2.25} />
          <span className="text-[11px] sm:text-[12px] font-black  whitespace-nowrap">
            {compact ? "Dark" : "Dark Mode"}
          </span>
        </>
      )}
    </button>
  );
}
