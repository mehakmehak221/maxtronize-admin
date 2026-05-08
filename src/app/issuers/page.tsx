"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import Link from 'next/link';

const issuers = [
  {
    id: 'ISS-001',
    name: 'Savanna Capital Partners',
    initials: 'SC',
    email: 'compliance@savannacap.com',
    country: 'Kenya',
    assets: '2 active • 3 pending',
    raised: '$14.9M',
    aum: '$18.2M',
    status: 'Verified',
    color: 'bg-blue-600'
  },
  {
    id: 'ISS-002',
    name: 'West Africa Infrastructure Fund',
    initials: 'WA',
    email: 'ops@waif.ng',
    country: 'Nigeria',
    assets: '1 active • 2 pending',
    raised: '$3.9M',
    aum: '$5.0M',
    status: 'Pending',
    color: 'bg-blue-600'
  },
  {
    id: 'ISS-003',
    name: 'Nile Green Capital',
    initials: 'NG',
    email: 'admin@nilegreen.eg',
    country: 'Egypt',
    assets: '0 active • 1 pending',
    raised: '$0.0M',
    aum: '$8.0M',
    status: 'Under Review',
    color: 'bg-blue-600'
  },
  {
    id: 'ISS-004',
    name: 'Meridian Asset Management',
    initials: 'MA',
    email: 'rwa@meridian.br',
    country: 'Brazil',
    assets: '0 active • 1 pending',
    raised: '$0.0M',
    aum: '$6.0M',
    status: 'Pending',
    color: 'bg-blue-600'
  },
  {
    id: 'ISS-005',
    name: 'Pacific Rim Real Assets',
    initials: 'PR',
    email: 'tokens@pacificrim.sg',
    country: 'Singapore',
    assets: '4 active • 5 pending',
    raised: '$42.1M',
    aum: '$61.0M',
    status: 'Verified',
    color: 'bg-blue-600'
  }
];

export default function IssuersPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Issuer Management (5)</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">Monitor and manage asset issuers</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Issuers Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
      >
      
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ISSUER</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">EMAIL</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">COUNTRY</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ASSETS</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">RAISED</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">AUM</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {issuers.map((issuer) => (
                <tr key={issuer.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-black">
                          {issuer.initials}
                       </div>
                       <span className="text-sm font-black text-slate-900 whitespace-nowrap">{issuer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-400 whitespace-nowrap">{issuer.email}</td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-500">{issuer.country}</td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-500 whitespace-nowrap">{issuer.assets}</td>
                  <td className="px-6 py-6 text-sm font-black text-slate-900">{issuer.raised}</td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-400">{issuer.aum}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                      issuer.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 
                      issuer.status === 'Pending' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                       {issuer.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link href={`/issuers/${issuer.id}`} className="p-2 text-slate-300 hover:text-[#9810FA] transition-colors inline-block">
                      <Eye size={20} />
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
