"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  XCircle,
  Building2,
  MapPin,
  Mail,
  Globe,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  User,
  ShieldCheck,
  ChevronRight,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
} from 'recharts';

const issuerData = {
  id: 'ISS-001',
  name: 'Savanna Capital Partners',
  location: 'Kenya',
  regNumber: 'CPB/123/2024',
  status: 'Verified',
  joined: '10/12/2025',
  bio: 'Leading real estate investment firm specializing in commercial properties across East Africa. 15+ years of experience in property development and asset management.',
  contact: {
    email: 'compliance@savannacap.com',
    phone: '+254 20 1234567',
    website: 'www.savannacap.com'
  },
  stats: {
    totalRaised: '$14.9M',
    aum: '$18.2M',
    totalInvestors: 487,
    avgYield: '9.2%'
  },
  assetSummary: {
    active: 2,
    submitted: 3,
    approved: 2,
    rejected: 0
  },
  personnel: [
    { name: 'James Mwangi', role: 'CEO', verified: true },
    { name: 'Sarah Otieno', role: 'CFO', verified: true },
    { name: 'David Kamau', role: 'Legal Counsel', verified: true },
  ],
  assets: [
    { id: 'AS-001', name: 'Nairobi Tech Hub', type: 'Real Estate', amount: '$3.5M', date: '04/15/2026', status: 'Under Review' },
    { id: 'AS-002', name: 'Mombasa Logistics Center', type: 'Real Estate', amount: '$2.8M', date: '03/22/2026', status: 'Approved' },
    { id: 'AS-003', name: 'Kisumu Solar Farm', type: 'Energy', amount: '$4.2M', date: '02/10/2026', status: 'Active' },
    { id: 'AS-004', name: 'Nairobi Residential Complex', type: 'Real Estate', amount: '$1.9M', date: '04/28/2026', status: 'Under Review' },
    { id: 'AS-005', name: 'East Africa Data Center', type: 'Infrastructure', amount: '$6.5M', date: '05/01/2026', status: 'Under Review' },
  ],
  financials: {
    revenue: [
      { label: 'Management Fees', value: '$142,000', percent: 65 },
      { label: 'Performance Fees', value: '$98,000', percent: 45 },
      { label: 'Admin Fees', value: '$76,000', percent: 35 },
    ],
    health: [
      { label: 'Liquidity Ratio', value: '2.4x', status: 'Healthy', statusColor: 'text-emerald-500' },
      { label: 'Debt-to-Equity', value: '0.35', status: 'Good', statusColor: 'text-emerald-500' },
      { label: 'ROI', value: '14.2%', status: 'Strong', statusColor: 'text-emerald-500' },
      { label: 'Operating Margin', value: '38%', status: 'Excellent', statusColor: 'text-emerald-500' },
      { label: 'Cash Reserve', value: '$2.1M', status: 'Adequate', statusColor: 'text-emerald-500' },
      { label: 'Credit Rating', value: 'A-', status: 'Good', statusColor: 'text-emerald-500' },
    ]
  },
  growthData: [
    { month: 'Nov', value: 2000000 },
    { month: 'Dec', value: 3500000 },
    { month: 'Jan', value: 5500000 },
    { month: 'Feb', value: 8000000 },
    { month: 'Mar', value: 11000000 },
    { month: 'Apr', value: 13500000 },
    { month: 'May', value: 14900000 },
  ]
};

export default function IssuerDetail() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Assets', 'Financials', 'Compliance'];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <Link href="/issuers" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             Back to Admin Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
               <Building2 size={28} className="text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{issuerData.name}</h1>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  {issuerData.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm font-bold text-slate-400">
                  <MapPin size={14} className="inline mr-1" /> {issuerData.location}
                </p>
                <span className="text-slate-200">•</span>
                <p className="text-sm font-bold text-slate-400">{issuerData.regNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#EF4444] text-white font-bold text-sm hover:bg-[#DC2626] transition-all shadow-lg shadow-rose-500/10">
            <XCircle size={18} />
            Suspend Issuer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-black transition-all relative flex items-center gap-2 ${
                activeTab === tab ? 'text-[#9810FA]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {tab === 'Assets' && (
                <span className="bg-[#9810FA] text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem]">5</span>
              )}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeIssuerTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9810FA]"
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
                { label: 'TOTAL RAISED', value: issuerData.stats.totalRaised, icon: DollarSign, color: 'text-[#9810FA]', bg: 'bg-[#F5F3FF]' },
                { label: 'AUM', value: issuerData.stats.aum, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'TOTAL INVESTORS', value: issuerData.stats.totalInvestors, icon: User, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'AVG. YIELD', value: issuerData.stats.avgYield, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon size={22} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 mb-4">Company Information</h2>
                    <p className="text-slate-500 leading-relaxed font-medium">{issuerData.bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                       <Mail size={16} className="text-slate-400" />
                       <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                          <p className="text-xs font-black text-slate-900 truncate">{issuerData.contact.email}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                       <Phone size={16} className="text-slate-400" />
                       <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                          <p className="text-xs font-black text-slate-900">{issuerData.contact.phone}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                       <Globe size={16} className="text-slate-400" />
                       <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Website</p>
                          <p className="text-xs font-black text-slate-900 truncate">{issuerData.contact.website}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                       <Calendar size={16} className="text-slate-400" />
                       <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined</p>
                          <p className="text-xs font-black text-slate-900">{issuerData.joined}</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Asset Summary</p>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Active', value: issuerData.assetSummary.active, color: 'text-emerald-500' },
                          { label: 'Submitted', value: issuerData.assetSummary.submitted, color: 'text-amber-500' },
                          { label: 'Approved', value: issuerData.assetSummary.approved, color: 'text-blue-500' },
                          { label: 'Rejected', value: issuerData.assetSummary.rejected, color: 'text-rose-500' },
                        ].map((stat) => (
                          <div key={stat.label} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-center">
                             <p className={`text-xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h2 className="text-lg font-black text-slate-900 mb-6">Growth Performance</h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={issuerData.growthData}>
                        <defs>
                          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} tickFormatter={(value) => `$${value/1000000}M`} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }} />
                        <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h2 className="text-lg font-black text-slate-900 mb-6">Key Personnel</h2>
                  <div className="space-y-4">
                    {issuerData.personnel.map((person) => (
                      <div key={person.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                        <div>
                           <p className="text-sm font-black text-slate-900">{person.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{person.role}</p>
                        </div>
                        {person.verified && <CheckCircle2 size={16} className="text-emerald-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Assets' && (
          <motion.div
            key="assets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
          >
             <div className="p-8 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900">All Assets (5)</h2>
             </div>
             <div className="divide-y divide-slate-100">
                {issuerData.assets.map((asset) => (
                  <div key={asset.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                           <Building2 size={24} />
                        </div>
                        <div>
                           <h3 className="text-sm font-black text-slate-900">{asset.name}</h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{asset.id} • {asset.type} • {asset.amount}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-12">
                        <div className="text-right hidden sm:block">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Submitted</p>
                           <p className="text-sm font-black text-slate-900">{asset.date}</p>
                        </div>
                        <div className="flex items-center gap-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                             asset.status === 'Active' || asset.status === 'Approved'
                               ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                               : 'bg-amber-50 text-amber-600 border-amber-100'
                           }`}>
                              {asset.status}
                           </span>
                           <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'Financials' && (
          <motion.div
            key="financials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
               <h2 className="text-lg font-black text-slate-900 mb-8">Revenue Breakdown</h2>
               <div className="space-y-8">
                  {issuerData.financials.revenue.map((item) => (
                    <div key={item.label} className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                          <span className="text-sm font-black text-slate-900">{item.value}</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-[#9810FA] rounded-full"
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
               <h2 className="text-lg font-black text-slate-900 mb-8">Financial Health Metrics</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {issuerData.financials.health.map((metric) => (
                    <div key={metric.label} className="p-6 rounded-[24px] bg-slate-50/50 border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{metric.label}</p>
                       <h3 className="text-xl font-black text-slate-900 mb-2">{metric.value}</h3>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${metric.statusColor}`}>
                          {metric.status}
                       </span>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Compliance' && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              { label: 'KYB Verification', desc: 'Business verification completed', status: 'Verified', date: '10/12/2025', icon: ShieldCheck, color: 'text-emerald-500' },
              { label: 'AML Screening', desc: 'Anti-money laundering checks passed', status: 'Passed', date: '10/12/2025', icon: Activity, color: 'text-emerald-500' },
              { label: 'Operating License', desc: 'Valid operating license on file', status: 'Active', date: '01/15/2026', icon: FileText, color: 'text-emerald-500' },
              { label: 'Insurance Coverage', desc: 'Professional liability insurance current', status: 'Current', date: '02/01/2026', icon: ShieldCheck, color: 'text-emerald-500' },
            ].map((item) => (
              <div key={item.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                       <item.icon size={24} />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-slate-900">{item.label}</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                    </div>
                 </div>
                 <div className="h-[1px] w-full bg-slate-100" />
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400">Last Updated: {item.date}</p>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                       {item.status}
                    </span>
                 </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
