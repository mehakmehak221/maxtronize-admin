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
          className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-lg text-slate-900"
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
        fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 z-50 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-7 h-20 flex items-center border-b border-slate-100">
          <Link href="/" className="relative h-12 w-full no-underline outline-none">
            <Image 
              src="/maxtronizelogo.png" 
              alt="Maxtronize" 
              fill
              className="object-contain object-left"
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
                    ? 'bg-[#9810FA] text-white shadow-lg shadow-[#9810FA]/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900 transition-colors'} />
                  <span className={`text-[13px] font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#9810FA] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9810FA] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#9810FA]/20">
              PA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-slate-900 leading-tight">Priya Admin</p>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">Super Admin</p>
            </div>
            <button 
              onClick={() => router.push('/login')}
              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
