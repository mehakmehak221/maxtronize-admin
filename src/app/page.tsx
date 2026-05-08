"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  Building2, 
  TrendingUp,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const stats = [
  { 
    label: 'TOTAL AUM', 
    value: '$42.8M', 
    change: '+12.4%', 
    icon: DollarSign, 
    color: '#3B82F6',
  },
  { 
    label: 'ACTIVE INVESTORS', 
    value: '1,284', 
    change: '+156', 
    icon: Users, 
    color: '#10B981',
  },
  { 
    label: 'ACTIVE ISSUERS', 
    value: '12', 
    change: '+3', 
    icon: Building2, 
    color: '#9810FA',
  },
  { 
    label: 'PLATFORM REVENUE', 
    value: '$3.14M', 
    change: '+28%', 
    icon: TrendingUp, 
    color: '#F97316',
  },
];

const revenueData = [
  { name: 'Jan', value: 150000 },
  { name: 'Feb', value: 185000 },
  { name: 'Mar', value: 230000 },
  { name: 'Apr', value: 245000 },
  { name: 'May', value: 270000 },
  { name: 'Jun', value: 314000 },
];

const donutData = [
  { name: 'Real Estate', value: 21.0, color: '#9810FA' },
  { name: 'Private Credit', value: 8.5, color: '#7C3AED' },
  { name: 'Commodities', value: 6.2, color: '#A78BFA' },
  { name: 'Infrastructure', value: 4.3, color: '#C4B5FD' },
];

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col"
          >
            <div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-black/5"
              style={{ backgroundColor: stat.color }}
            >
              <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5">{stat.label}</p>
              <div className="flex items-baseline gap-2.5">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                <span className="text-[11px] md:text-xs font-black text-emerald-500">{stat.change}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white p-6 md:p-12 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm"
        >
          <div className="mb-8 md:mb-12">
            <h2 className="text-base md:text-xl font-black text-slate-900 mb-1.5">Revenue & Payouts</h2>
            <p className="text-[11px] md:text-sm text-slate-400 font-bold">Monthly revenue & partner payouts · YTD 2026</p>
          </div>
          
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
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
                  tickFormatter={(val: any) => `$${(Number(val) / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontWeight: 900 }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 md:p-12 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col"
        >
          <div className="mb-8 md:mb-12">
            <h2 className="text-base md:text-xl font-black text-slate-900 tracking-tight mb-1.5">AUM by Asset Type</h2>
            <p className="text-[11px] md:text-sm text-slate-400 font-bold">Total $42.0M tokenized</p>
          </div>
          
          <div className="relative w-full aspect-square flex items-center justify-center mb-8 md:mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="90%"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 md:space-y-4">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-sm md:text-base font-black text-slate-900">${item.value}M</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
