"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  XCircle,
  FileText,
  TrendingUp,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  PieChart,
  ShieldAlert,
  Activity,
  User,
  Mail,
  Phone,
  Wallet,
} from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme/ThemeToggleButton';
import { PageEnter } from '@/components/layout/PageEnter';
import { ClientSizedChart } from '@/components/charts/ClientSizedChart';
import { useTheme } from '@/components/theme/ThemeProvider';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for the specific investor
const investorData = {
  id: '1',
  name: 'Marcus Chen',
  email: 'm.chen@maxtronize.io',
  phone: '+1 415 555 0123',
  country: 'California, United States',
  joined: '01/15/2026',
  wallet: '0x7f2...a4b9',
  tier: 'Platinum',
  status: 'KYC Verified',
  bio: 'Seasoned technology investor with focus on real estate and infrastructure. Portfolio includes commercial properties across the US and emerging markets.',
  stats: {
    portfolioValue: '$248,650',
    totalInvested: '$235,000',
    currentReturn: '+5.8%',
    activeInvestments: 7,
    avgYield: '9.4%',
    distributions: '$18,420',
    unrealizedGains: '$13,650'
  },
  portfolioAllocation: [
    { name: 'Real Estate', value: 62, color: '#9810FA' },
    { name: 'Private Credit', value: 18, color: '#7C3AED' },
    { name: 'Commodities', value: 12, color: '#A78BFA' },
    { name: 'Art & Collectibles', value: 8, color: '#C4B5FD' },
  ],
  investments: [
    { name: 'Prime Office Tower NYC', id: 'PONYC', tokens: 45, invested: '$50,000', value: '$55,800', return: '+11.6%', gain: '+$5,800', status: 'Active' },
    { name: 'Solar Farm Alpha TX', id: 'SFATX', tokens: 125, invested: '$35,000', value: '$35,625', return: '+1.8%', gain: '+$625', status: 'Active' },
    { name: 'Harbor Ports PE Fund', id: 'HPPE', tokens: 50, invested: '$75,000', value: '$82,500', return: '+10%', gain: '+$7,500', status: 'Active' },
    { name: 'Copper Mining Royalty', id: 'CMRF', tokens: 300, invested: '$28,000', value: '$28,800', return: '+2.9%', gain: '+$800', status: 'Active' },
    { name: 'Nashville Office Tower', id: 'NOTWR', tokens: 55, invested: '$47,000', value: '$48,125', return: '+2.4%', gain: '+$1,125', status: 'Active' },
  ],
  transactions: [
    { type: 'Investment', asset: 'Prime Office Tower', amount: '-$50,000', date: '01/20/2026', status: 'Completed', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { type: 'Distribution', asset: 'Harbor Ports PE', amount: '+$4,200', date: '02/15/2026', status: 'Completed', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { type: 'Investment', asset: 'Solar Farm Alpha', amount: '-$35,000', date: '03/10/2026', status: 'Completed', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { type: 'Distribution', asset: 'Prime Office Tower', amount: '+$3,100', date: '04/01/2026', status: 'Completed', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { type: 'Investment', asset: 'Nashville Office', amount: '-$47,000', date: '04/22/2026', status: 'Completed', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
  ],
  compliance: [
    { label: 'KYC Verification', status: 'Verified', date: '01/15/2026', desc: 'Identity verification completed', icon: ShieldCheck, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'AML Screening', status: 'Passed', date: '01/15/2026', desc: 'Anti-money laundering checks passed', icon: ShieldAlert, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'Accreditation Status', status: 'Verified', date: '01/16/2026', desc: 'Accredited investor status confirmed', icon: FileText, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'Tax Documentation', status: 'Complete', date: '01/18/2026', desc: 'W-9 and required tax forms on file', icon: FileText, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  ],
  performanceData: [
    { name: 'Jan', value: 200000 },
    { name: 'Feb', value: 215000 },
    { name: 'Mar', value: 220000 },
    { name: 'Apr', value: 238000 },
    { name: 'May', value: 248650 },
  ]
};

export default function UserDetails() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Investments', 'Transactions', 'Compliance'];
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <Link href="/users" className="flex items-center gap-2 text-sm font-bold text-[var(--shell-muted)] hover:text-[var(--foreground)] transition-colors group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             Back to Admin Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/35 shadow-sm overflow-hidden">
               <User size={28} className="text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-[var(--foreground)] ">{investorData.name}</h1>
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase ">
                  {investorData.tier}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm font-bold text-[var(--shell-muted)]">
                  <MapPin size={14} className="inline mr-1" /> {investorData.country}
                </p>
                <span className="text-[var(--shell-card-border)]">•</span>
                <p className="text-sm font-bold text-[var(--shell-muted)]">Accredited Investor</p>
                <span className="text-[var(--shell-card-border)]">•</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase  bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" aria-hidden /> {investorData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggleButton compact />
          <button type="button" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] font-bold text-sm hover:bg-[var(--shell-subtle)] transition-all shadow-sm dark:shadow-none dark:bg-transparent dark:border-white/20 dark:hover:bg-white/[0.06]">
            <Download size={18} />
            Export Report
          </button>
          <button type="button" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#EF4444] text-white font-bold text-sm hover:bg-[#DC2626] transition-all shadow-lg shadow-rose-500/10">
            <XCircle size={18} />
            Suspend Account
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--shell-card-border)]">
        <div className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-black transition-all relative flex items-center gap-2 ${
                activeTab === tab ? 'text-[var(--shell-active)]' : 'text-[var(--shell-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab}
              {tab === 'Investments' && (
                <span className="bg-[var(--shell-active)] text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem]">{investorData.investments.length}</span>
              )}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeUserTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--shell-active)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'Overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'PORTFOLIO VALUE', value: investorData.stats.portfolioValue, icon: DollarSign, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-500/15' },
                { label: 'TOTAL INVESTED', value: investorData.stats.totalInvested, icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/15' },
                { label: 'CURRENT RETURN', value: investorData.stats.currentReturn, icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/15' },
                { label: 'ACTIVE INVESTMENTS', value: investorData.stats.activeInvestments, icon: PieChart, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/15' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[var(--shell-card)] p-6 rounded-[28px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon size={22} />
                  </div>
                  <p className="text-[11px] font-bold text-[var(--shell-muted)] uppercase  mb-2">{stat.label}</p>
                  <h3 className="text-2xl font-black text-[var(--foreground)]">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Investor Profile */}
                <div className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-[var(--foreground)] mb-4">Investor Profile</h2>
                    <p className="text-[var(--shell-muted)] leading-relaxed font-medium">{investorData.bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-[11px] font-black text-[var(--shell-muted)] uppercase ">Contact Information</p>
                      <div className="space-y-3">
                         <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]">
                            <Mail size={16} className="text-[var(--shell-muted)]" />
                            <div>
                               <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase ">Email</p>
                               <p className="text-xs font-black text-[var(--foreground)]">{investorData.email}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]">
                            <Phone size={16} className="text-[var(--shell-muted)]" />
                            <div>
                               <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase ">Phone</p>
                               <p className="text-xs font-black text-[var(--foreground)]">{investorData.phone}</p>
                            </div>
                         </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[11px] font-black text-[var(--shell-muted)] uppercase ">&nbsp;</p>
                       <div className="space-y-3">
                         <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]">
                            <Calendar size={16} className="text-[var(--shell-muted)]" />
                            <div>
                               <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase ">Joined</p>
                               <p className="text-xs font-black text-[var(--foreground)]">{investorData.joined}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]">
                            <Wallet size={16} className="text-[var(--shell-muted)]" />
                            <div>
                               <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase ">Wallet</p>
                               <p className="text-xs font-black text-[var(--foreground)]">{investorData.wallet}</p>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[11px] font-black text-[var(--shell-muted)] uppercase ">Investment Statistics</p>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Avg. Yield', value: investorData.stats.avgYield, color: 'text-emerald-500' },
                          { label: 'Distributions', value: investorData.stats.distributions, color: 'text-[var(--foreground)]' },
                          { label: 'Unrealized Gains', value: investorData.stats.unrealizedGains, color: 'text-[var(--foreground)]' },
                          { label: 'Total Investments', value: investorData.stats.activeInvestments, color: 'text-[var(--foreground)]' },
                        ].map((stat) => (
                          <div key={stat.label} className="bg-[var(--shell-subtle)] p-5 rounded-2xl border border-[var(--shell-card-border)] text-center">
                             <p className="text-sm font-black text-[var(--foreground)] mb-1" style={{ color: stat.color.includes('emerald') ? '#10B981' : '' }}>{stat.value}</p>
                             <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase ">{stat.label}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm">
                  <h2 className="text-lg font-black text-[var(--foreground)] mb-6">Portfolio Performance</h2>
                  <ClientSizedChart className="h-64 w-full min-h-[16rem] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={investorData.performanceData}>
                        <defs>
                          <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={isDark ? 0.25 : 0.1}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9'} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                          tickFormatter={(value) => `$${value/1000}K`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none', 
                            boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.45)' : '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                            fontWeight: 900,
                            background: isDark ? '#0f172b' : '#ffffff',
                            color: isDark ? '#f8fafc' : '#0f172a',
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorPerf)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ClientSizedChart>
                </div>
              </div>

              {/* Allocation */}
              <div className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm flex flex-col">
                <h2 className="text-lg font-black text-[var(--foreground)] mb-6">Portfolio Allocation</h2>
                <ClientSizedChart className="relative w-full min-h-[220px] min-w-0 max-w-[280px] aspect-square flex items-center justify-center mb-10 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={investorData.portfolioAllocation}
                        innerRadius="65%"
                        outerRadius="90%"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {investorData.portfolioAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ClientSizedChart>
                <div className="space-y-4 flex-1">
                  {investorData.portfolioAllocation.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                        <span className="text-[11px] font-black text-[var(--shell-muted)] uppercase ">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-[var(--foreground)]">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Investments' && (
          <motion.div
            key="investments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm overflow-hidden"
          >
             <div className="p-8 border-b border-[var(--shell-card-border)]">
                <h2 className="text-lg font-black text-[var(--foreground)]">Active Investments (5)</h2>
             </div>
             <div className="divide-y divide-[var(--shell-card-border)]">
                {investorData.investments.map((inv) => (
                  <div key={inv.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[var(--shell-subtle)] transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-100 border border-violet-200 text-violet-700 dark:bg-violet-500/20 dark:border-violet-500/35 dark:text-violet-300 flex items-center justify-center">
                           <Building2 size={24} />
                        </div>
                        <div>
                           <h3 className="text-sm font-black text-[var(--foreground)]">{inv.name}</h3>
                           <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase  mt-0.5">{inv.id} • {inv.tokens} tokens</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
                        <div>
                           <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase  mb-1">Invested</p>
                           <p className="text-sm font-black text-[var(--foreground)]">{inv.invested}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase  mb-1">Current Value</p>
                           <p className="text-sm font-black text-[var(--foreground)]">{inv.value}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase  mb-1">Return</p>
                           <p className="text-sm font-black text-emerald-500">{inv.return}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase  mb-1">Gain/Loss</p>
                           <p className="text-sm font-black text-emerald-500">{inv.gain}</p>
                        </div>
                     </div>
                     <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase  border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25 self-start md:self-center">
                        {inv.status}
                     </span>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'Transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm overflow-hidden"
          >
             <div className="p-8 border-b border-[var(--shell-card-border)]">
                <h2 className="text-lg font-black text-[var(--foreground)]">Transaction History</h2>
             </div>
             <div className="divide-y divide-[var(--shell-card-border)]">
                {investorData.transactions.map((tx, i) => (
                  <div key={i} className="p-8 flex items-center justify-between hover:bg-[var(--shell-subtle)] transition-colors">
                     <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                            tx.type === 'Investment'
                              ? 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25'
                              : 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25'
                          }`}
                        >
                           <tx.icon size={20} />
                        </div>
                        <div>
                           <h3 className="text-sm font-black text-[var(--foreground)]">{tx.type}</h3>
                           <p className="text-xs font-bold text-[var(--shell-muted)] mt-0.5">{tx.asset}</p>
                        </div>
                     </div>
                     <div className="text-right flex items-center gap-12">
                        <div>
                           <p className={`text-sm font-black ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-[var(--foreground)]'}`}>{tx.amount}</p>
                           <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase  mt-0.5">{tx.date}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase  border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25 hidden sm:block">
                           {tx.status}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'Compliance' && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {investorData.compliance.map((item) => (
              <div key={item.label} className="bg-[var(--shell-card)] p-6 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none group">
                <div className="flex items-center justify-between mb-6">
                   <div className={`w-12 h-12 rounded-2xl border border-emerald-200/80 dark:border-emerald-500/25 ${item.bgColor} dark:bg-emerald-500/15 ${item.color} dark:text-emerald-400 flex items-center justify-center`}>
                      <item.icon size={24} />
                   </div>
                </div>
                <div className="pb-6 border-b border-[var(--shell-card-border)] mb-6">
                   <h3 className="text-sm font-black text-[var(--foreground)]">{item.label}</h3>
                   <p className="text-xs text-[var(--shell-muted)] font-bold mt-1">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-[var(--shell-muted)] uppercase ">Last Updated: {item.date}</span>
                   <span className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase  bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25">
                      {item.status}
                   </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </PageEnter>
  );
}
