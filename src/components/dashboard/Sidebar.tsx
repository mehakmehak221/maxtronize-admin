"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Building2, 
  ShieldCheck, 
  ArrowLeftRight, 
  FileText, 
  PieChart,
  LogOut,
  X,
  Menu
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/' },
  { icon: CheckSquare, label: 'Asset Approvals', href: '/assets', badge: '4' },
  { icon: Users, label: 'Users', href: '/users', badge: '2' },
  { icon: Building2, label: 'Issuers', href: '/issuers' },
  { icon: ShieldCheck, label: 'Admin RBAC', href: '/rbac' },
  { icon: ArrowLeftRight, label: 'Transactions', href: '/transactions' },
  { icon: FileText, label: 'Compliance', href: '/compliance' },
  { icon: PieChart, label: 'Analytics', href: '/analytics' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  if (pathname === '/login') return null;

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-xl shadow-lg border border-[var(--shell-mobile-btn-border)] bg-[var(--shell-mobile-btn)] text-[var(--foreground)]"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-64 z-50 flex flex-col transition-transform duration-300 ease-in-out
        border-r border-[var(--shell-sidebar-border)] bg-[var(--shell-sidebar)] text-[var(--foreground)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-7 h-20 flex items-center border-b border-[var(--shell-sidebar-border)]">
          <Link href="/" className="relative h-12 w-full no-underline outline-none">
            <Image 
              src="/maxtronizelogo.png" 
              alt="Maxtronize" 
              fill
              className="object-contain object-left dark:brightness-0 dark:invert"
              priority
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-[14px] transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[var(--shell-active)] text-white shadow-lg shadow-[var(--shell-active)]/25' 
                    : 'text-[var(--shell-muted)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-[var(--foreground)]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon size={18} className={isActive ? 'text-white' : 'opacity-80 group-hover:opacity-100 transition-opacity'} />
                  <span className={`text-[13px] font-bold  ${isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[var(--shell-active)] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[var(--shell-sidebar-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--shell-active)] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[var(--shell-active)]/25">
              PA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-[var(--foreground)] leading-tight">Priya Admin</p>
              <p className="text-[11px] font-bold text-[var(--shell-muted)] mt-0.5">Super Admin</p>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem("maxtronize-admin-token");
                localStorage.removeItem("maxtronize-admin-2fa");
                router.push('/login');
              }}
              className="p-2 text-[var(--shell-muted)] hover:text-rose-500 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
