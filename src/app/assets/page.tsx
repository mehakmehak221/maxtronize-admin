"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Download, Eye } from 'lucide-react';
import Link from 'next/link';

const pendingAssets = [
  {
    id: 'AS-001',
    name: 'Nairobi Tech Hub',
    issuer: 'Savanna Capital Partners',
    type: 'Real Estate',
    amount: '$3.5M',
    date: '04/15/2026',
    status: 'Under Review'
  },
  {
    id: 'AS-002',
    name: 'Lagos Port Expansion',
    issuer: 'West Africa Infrastructure Fund',
    type: 'Infrastructure',
    amount: '$2.0M',
    date: '04/22/2026',
    status: 'Pending'
  },
  {
    id: 'AS-003',
    name: 'Cairo Solar Project',
    issuer: 'Nile Green Capital',
    type: 'Energy',
    amount: '$8.0M',
    date: '04/28/2026',
    status: 'Under Review'
  },
  {
    id: 'AS-004',
    name: 'São Paulo Office Tower',
    issuer: 'Meridian Asset Management',
    type: 'Real Estate',
    amount: '$2.1M',
    date: '05/01/2026',
    status: 'Pending'
  }
];

export default function AssetsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Asset Management</h1>
          <p className="text-xs md:text-sm font-bold text-slate-400 mt-1">Review and manage platform assets</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-slate-50">
           <h2 className="text-base md:text-lg font-black text-slate-900">Pending Asset Approvals ({pendingAssets.length})</h2>
           <p className="text-xs md:text-sm font-bold text-slate-400 mt-1">Review and approve submitted assets</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ASSET ID</th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ASSET NAME</th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ISSUER</th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">TYPE</th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">AMOUNT</th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE</th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingAssets.map((asset) => (
                <tr key={asset.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 md:px-8 py-5 md:py-6 text-sm font-black text-slate-900 whitespace-nowrap">{asset.id}</td>
                  <td className="px-4 md:px-6 py-5 md:py-6">
                    <Link href={`/assets/${asset.id}`} className="text-sm font-black text-slate-900 hover:text-[#9810FA] transition-colors whitespace-nowrap">
                       {asset.name}
                    </Link>
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6 text-sm font-bold text-slate-400 whitespace-nowrap">{asset.issuer}</td>
                  <td className="px-4 md:px-6 py-5 md:py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                      asset.type === 'Real Estate' ? 'bg-[#F5F3FF] text-[#9810FA]' : 
                      asset.type === 'Infrastructure' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                       {asset.type}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6 text-sm font-black text-slate-900">{asset.amount}</td>
                  <td className="px-4 md:px-6 py-5 md:py-6 text-sm font-bold text-slate-400 whitespace-nowrap">{asset.date}</td>
                  <td className="px-4 md:px-6 py-5 md:py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                      asset.status === 'Under Review' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                       {asset.status}
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                    <div className="flex justify-end gap-2 md:gap-3">
                      <Link href={`/assets/${asset.id}`} className="p-2 text-slate-300 hover:text-[#9810FA] transition-colors">
                        <Eye size={18} />
                      </Link>
                      <button className="p-2 text-emerald-400 hover:text-emerald-600 transition-colors">
                        <CheckCircle2 size={18} />
                      </button>
                      <button className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
                        <XCircle size={18} />
                      </button>
                    </div>
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
