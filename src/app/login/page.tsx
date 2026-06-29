"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Terminal, Lock, AlertCircle } from 'lucide-react';
import { useLoginMutation } from '@/store';

const AUTH_TOKEN_KEY = "maxtronize-admin-token";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Field-level errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [login, { isLoading: isSubmitting }] = useLoginMutation();

  useEffect(() => {
    if (localStorage.getItem(AUTH_TOKEN_KEY)) {
      router.replace("/");
    }
  }, [router]);

  // --- Validators ---
  const validateEmail = (value: string): string => {
    if (!value.trim()) return "Email address is required.";
    if (!EMAIL_REGEX.test(value.trim())) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  // --- Blur handlers ---
  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));

  // --- Submit ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await login({
        email: email.trim(),
        password: password.trim(),
        role: "ADMIN"
      }).unwrap();

      localStorage.setItem(AUTH_TOKEN_KEY, response.id);
      localStorage.setItem("maxtronize-admin-role", response.role);

      if (twoFA) {
        localStorage.setItem("maxtronize-admin-2fa", "enabled");
      } else {
        localStorage.removeItem("maxtronize-admin-2fa");
      }

      setSuccessMsg("Secure Authentication Successful! Loading Dashboard...");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      console.error("Login failed:", err);
      let message = err?.data?.message || err?.message || "Invalid credentials or server error. Please try again.";
      if (typeof message === "string" && (message.toLowerCase().includes("password") || message.toLowerCase().includes("credential"))) {
        message = "Wrong password or invalid credentials.";
      }
      setErrorMsg(message);
    }
  };

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
            <h1 className="text-2xl font-bold text-white mb-1.5">
              Admin Access
            </h1>
            <p className="text-slate-400 text-sm font-medium">Maxtronize Super Admin Panel</p>
          </div>

          <div className="px-8 py-3 bg-black/40 border-y border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
              <span className="text-emerald-500 text-[10px] font-bold uppercase">System Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="text-[#9810FA] w-3.5 h-3.5" />
              <span className="text-[#9810FA] text-[10px] font-mono font-bold">v4.2.1 Stable</span>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} noValidate className="p-10 space-y-6">
            {/* API-level error */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  key="api-error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-4 rounded-xl text-xs font-semibold text-rose-400 border border-rose-500/25 bg-rose-500/10 flex items-center gap-2.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success banner */}
            <AnimatePresence>
              {successMsg && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-4 rounded-xl text-xs font-semibold text-emerald-400 border border-emerald-500/25 bg-emerald-500/10 flex items-center gap-2.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase block ml-1">
                Admin Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                  if (errorMsg) setErrorMsg("");
                }}
                onBlur={handleEmailBlur}
                placeholder="admin@maxtronize.com"
                autoComplete="email"
                className="w-full px-5 py-3.5 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: emailError
                    ? '1px solid rgba(239,68,68,0.6)'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: emailError ? '0 0 0 3px rgba(239,68,68,0.08)' : 'none',
                }}
              />
              <AnimatePresence>
                {emailError && (
                  <motion.p
                    key="email-err"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-rose-400 ml-1 overflow-hidden"
                  >
                    <AlertCircle size={11} className="shrink-0" />
                    {emailError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase block ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                    if (errorMsg) setErrorMsg("");
                  }}
                  onBlur={handlePasswordBlur}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="w-full px-5 py-3.5 pr-12 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: passwordError
                      ? '1px solid rgba(239,68,68,0.6)'
                      : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: passwordError ? '0 0 0 3px rgba(239,68,68,0.08)' : 'none',
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
              <AnimatePresence>
                {passwordError && (
                  <motion.p
                    key="pw-err"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-rose-400 ml-1 overflow-hidden"
                  >
                    <AlertCircle size={11} className="shrink-0" />
                    {passwordError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* 2FA toggle */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setTwoFA(!twoFA)}>
              <div className="w-4 h-4 rounded-md border border-white/10 flex items-center justify-center transition-all"
                style={{ background: twoFA ? '#9810FA' : 'rgba(0,0,0,0.3)' }}>
                {twoFA && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className="text-slate-500 text-xs font-medium group-hover:text-slate-400 transition-colors">Enable 2FA for this session</span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-transparent disabled:border-white/5"
              style={{
                background: isSubmitting
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'linear-gradient(135deg, #9810FA 0%, #6366F1 100%)',
                boxShadow: isSubmitting ? 'none' : '0 8px 32px rgba(152,16,250,0.4)',
              }}
            >
              {isSubmitting ? (
                <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <Lock size={18} />
              )}
              {isSubmitting ? "Signing in…" : "Secure Admin Login"}
            </button>

            <p className="text-center text-slate-600 text-[10px] font-medium">
              Protected by bank-grade encryption • All activity logged
            </p>
          </form>
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
          <p className="text-[11px] font-bold">
            <span className="text-amber-500/90">Authorized personnel only</span>
            <span className="text-slate-700 mx-2">•</span>
            <span className="text-rose-500/80">Unauthorized access is prohibited</span>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
