"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const userGrowthData = [
  { name: 'Nov', value: 780 },
  { name: 'Dec', value: 880 },
  { name: 'Jan', value: 1020 },
  { name: 'Feb', value: 1120 },
  { name: 'Mar', value: 1210 },
  { name: 'Apr', value: 1280 },
];

const assetPerformanceData = [
  { name: 'Real Estate', value: 9.2 },
  { name: 'Private Equity', value: 12.8 },
  { name: 'Infrastructure', value: 8.9 },
  { name: 'Commodities', value: 6.5 },
  { name: 'Energy', value: 10.2 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen pb-20">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'AVG TRANSACTION SIZE', value: '$42,580', change: '+12.4%', up: true },
          { label: 'USER RETENTION RATE', value: '87.3%', change: '+3.2%', up: true },
          { label: 'ASSET APPROVAL TIME', value: '3.2 days', change: '-18%', up: false },
          { label: 'PLATFORM UPTIME', value: '99.97%', change: '+0.02%', up: true },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
             <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                <div className={`flex items-center gap-1 text-[11px] font-black ${stat.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {stat.change}
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="mb-10">
            <h2 className="text-lg font-black text-slate-900">User Growth</h2>
            <p className="text-xs font-bold text-slate-400 mt-1">Monthly active users • Last 6 months</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                  ticks={[0, 350, 700, 1050, 1400]}
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Performance Chart */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="mb-10">
            <h2 className="text-lg font-black text-slate-900">Asset Performance</h2>
            <p className="text-xs font-bold text-slate-400 mt-1">Avg return by asset category</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                  tickFormatter={(value) => `${value}%`}
                  ticks={[0, 4, 8, 12, 16]}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                  formatter={(value) => [`${value}%`, 'Return']}
                />
                <Bar 
                  dataKey="value" 
                  fill="#10B981" 
                  radius={[8, 8, 0, 0]} 
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
