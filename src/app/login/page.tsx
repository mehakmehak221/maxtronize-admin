"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Terminal, Lock } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #2D1B69 0%, #0F172B 60%, #080C14 100%)',
      }}
    >
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
          style={{
            background: 'rgba(23, 20, 51, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Header Section */}
          <div className="pt-12 pb-8 px-10 text-center">
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-[#9810FA] blur-3xl opacity-40 rounded-full scale-150" />
              <div
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #9810FA 0%, #7C3AED 100%)' }}
              >
                <Shield className="text-white w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
              Admin Access
            </h1>
            <p className="text-slate-400 text-sm font-medium">Maxtronize Super Admin Panel</p>
          </div>

         
          <div className="px-8 py-3 bg-black/40 border-y border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
              <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">System Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="text-[#9810FA] w-3.5 h-3.5" />
              <span className="text-[#9810FA] text-[10px] font-mono font-bold tracking-tight">v4.2.1 Stable</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-10 space-y-7">
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] block ml-1">Admin Email</label>
              <input
                type="email"
                placeholder="admin@maxtronize.com"
                className="w-full px-5 py-3.5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] block ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••"
                  className="w-full px-5 py-3.5 pr-12 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setTwoFA(!twoFA)}>
              <div className="w-4 h-4 rounded-md border border-white/10 flex items-center justify-center transition-all"
                   style={{ background: twoFA ? '#9810FA' : 'rgba(0,0,0,0.3)' }}>
                 {twoFA && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className="text-slate-500 text-xs font-medium group-hover:text-slate-400 transition-colors">Enable 2FA for this session</span>
            </div>

            <button
              className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #9810FA 0%, #6366F1 100%)',
                boxShadow: '0 8px 32px rgba(152,16,250,0.4)',
              }}
            >
              <Lock size={18} />
              Secure Admin Login
            </button>

            <p className="text-center text-slate-600 text-[10px] font-medium tracking-wide">
              Protected by bank-grade encryption • All activity logged
            </p>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          <div className="w-4 h-4 text-amber-500">
             <Shield size={14} fill="currentColor" fillOpacity={0.2} />
          </div>
          <p className="text-[11px] font-bold tracking-tight">
            <span className="text-amber-500/90">Authorized personnel only</span>
            <span className="text-slate-700 mx-2">•</span>
            <span className="text-rose-500/80">Unauthorized access is prohibited</span>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
