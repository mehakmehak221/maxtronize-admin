"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Settings, Bell } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();
  if (pathname === '/login') return null;
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
    >
      <div className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#155DFC] to-[#9810FA] rounded-xl flex items-center justify-center">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-heading ">Maxtronize<span className="text-[#155DFC]">.</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="#" className="hover:text-white transition-colors">Overview</Link>
          <Link href="#" className="hover:text-white transition-colors">Analytics</Link>
          <Link href="#" className="hover:text-white transition-colors">Customers</Link>
          <Link href="#" className="hover:text-white transition-colors">Support</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <Settings size={20} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer">
            <Users className="text-blue-400 w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
