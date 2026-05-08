"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Globe, 
  Coins, 
  FileText, 
  TrendingUp, 
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');

  const asset = {
    id: params.id,
    name: 'Nairobi Tech Hub',
    issuer: 'Savanna Capital Partners',
    type: 'Real Estate',
    valuation: '$3,500,000',
    tokens: '3,500,000 MTX',
    price: '$1.00',
    compliance: 'Compliant',
    risk: 'Medium-Low',
    jurisdiction: 'Kenya'
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'financials', label: 'Financials', icon: TrendingUp },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-[#F8FAFC] min-h-screen pb-20">
      <div className="flex items-center gap-4">
        <Link href="/assets" className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{asset.name}</h1>
             <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Active</span>
          </div>
          <p className="text-xs md:text-sm font-bold text-slate-400 mt-1">{asset.issuer} • {asset.id}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 w-full overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-[12px] md:rounded-[14px] text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? 'text-white' : 'text-slate-400'} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-2 space-y-6 md:space-y-8">
                <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm">
                   <div className="flex items-center justify-between mb-8 md:mb-10">
                      <h3 className="text-base md:text-lg font-black text-slate-900">Asset Tokenomics</h3>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl bg-slate-50 text-slate-900 text-xs font-bold">1M</button>
                        <button className="px-4 py-2 rounded-xl bg-slate-50 text-slate-900 text-xs font-bold">6M</button>
                        <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">1Y</button>
                      </div>
                   </div>
                   <div className="h-[250px] md:h-[350px] w-full bg-[#F8FAFC] rounded-[24px] flex items-center justify-center border border-dashed border-slate-200">
                      <div className="text-center">
                        <TrendingUp className="text-slate-200 w-12 md:w-16 h-12 md:h-16 mx-auto mb-4" />
                        <p className="text-xs md:text-sm font-bold text-slate-400">Token Performance Graph</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                       <ShieldCheck size={20} />
                    </div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">COMPLIANCE STATUS</h4>
                    <p className="text-xl md:text-2xl font-black text-slate-900">{asset.compliance}</p>
                  </div>
                  <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6">
                       <AlertCircle size={20} />
                    </div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">RISK PROFILE</h4>
                    <p className="text-xl md:text-2xl font-black text-slate-900">{asset.risk}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className="text-base md:text-lg font-black text-slate-900 mb-8">Asset Details</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Valuation</p>
                      <p className="text-lg md:text-xl font-black text-slate-900">{asset.valuation}</p>
                    </div>
                    <div className="pt-6 border-t border-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Token Supply</p>
                      <p className="text-lg md:text-xl font-black text-slate-900">{asset.tokens}</p>
                    </div>
                    <div className="pt-6 border-t border-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Jurisdictions</p>
                      <p className="text-lg md:text-xl font-black text-slate-900">{asset.jurisdiction}</p>
                    </div>
                    <button className="w-full py-4 rounded-2xl bg-[#9810FA] text-white font-black text-sm shadow-lg shadow-[#9810FA]/20 flex items-center justify-center gap-3 mt-4">
                      <Download size={18} />
                      Download Report
                    </button>
                  </div>
                </div>

                <div className="bg-[#9810FA] p-6 md:p-8 rounded-[24px] md:rounded-[32px] text-white shadow-xl shadow-[#9810FA]/10">
                  <Coins className="w-10 h-10 md:w-12 md:h-12 mb-6 opacity-40" />
                  <h3 className="text-base md:text-lg font-black mb-2">Secondary Market</h3>
                  <p className="text-xs md:text-sm font-bold opacity-80 leading-relaxed mb-6">Access decentralized liquidity pools for this asset on the Maxtronize DEX.</p>
                  <button className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-black text-[11px] uppercase tracking-widest">View Liquidity Pools</button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
             <div className="bg-white p-10 md:p-20 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mb-8">
                   <FileText size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{tabs.find(t => t.id === activeTab)?.label} Data</h3>
                <p className="text-sm font-bold text-slate-400 max-w-xs">Detailed {activeTab} information is being synchronized from the distributed ledger.</p>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
