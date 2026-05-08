"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  UserMinus, 
  Download,
  Mail,
  MapPin,
  Calendar,
  Wallet,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

const investors = [
  {
    id: '1',
    name: 'Marcus Chen',
    email: 'm.chen@maxtronize.io',
    country: 'United States',
    kycStatus: 'Verified',
    portfolioValue: '$248,650',
    invested: '$235,000',
    joined: '01/15/2026',
    initials: 'MC',
    color: 'bg-indigo-500'
  },
  {
    id: '2',
    name: 'Aisha Okonkwo',
    email: 'a.okonkwo@invest.ng',
    country: 'Nigeria',
    kycStatus: 'Verified',
    portfolioValue: '$124,800',
    invested: '$118,000',
    joined: '11/03/2025',
    initials: 'AO',
    color: 'bg-[#9810FA]'
  },
  {
    id: '3',
    name: 'Ravi Krishnamurthy',
    email: 'ravi.k@infrapartners.in',
    country: 'India',
    kycStatus: 'Pending',
    portfolioValue: '$0',
    invested: '$0',
    joined: '04/28/2026',
    initials: 'RK',
    color: 'bg-rose-500'
  },
  {
    id: '4',
    name: 'Sofia Andersson',
    email: 's.andersson@nordicap.se',
    country: 'Sweden',
    kycStatus: 'Verified',
    portfolioValue: '$87,500',
    invested: '$82,000',
    joined: '02/12/2026',
    initials: 'SA',
    color: 'bg-emerald-500'
  }
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Investor Management (4)</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">Monitor and manage investor accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all bg-white shadow-sm">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Investor</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">KYC Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio Value</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invested</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {investors.map((investor) => (
                <tr key={investor.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${investor.color} flex items-center justify-center text-white font-black text-xs shadow-lg shadow-black/5`}>
                        {investor.initials}
                      </div>
                      <span className="text-sm font-black text-slate-900">{investor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-400">{investor.email}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-400">{investor.country}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      investor.kycStatus === 'Verified' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {investor.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900">{investor.portfolioValue}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-400">{investor.invested}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-400">{investor.joined}</td>
                  <td className="px-8 py-5 text-right">
                    <Link href={`/users/${investor.id}`} className="p-2 text-slate-300 hover:text-[#9810FA] transition-colors inline-block">
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
