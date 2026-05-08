"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter } from 'lucide-react';

const transactions = [
  {
    id: 'TX-10245',
    type: 'Investment',
    asset: 'Prime Office Tower NYC',
    investor: 'Marcus Chen',
    amount: '$50,000',
    fee: '$500',
    status: 'Completed',
    date: '05/02/2026 10:42 AM'
  },
  {
    id: 'TX-10244',
    type: 'Distribution',
    asset: 'Harbor Ports PE Fund',
    investor: 'Aisha Okonkwo',
    amount: '$8,400',
    fee: '$0',
    status: 'Completed',
    date: '05/02/2026 09:15 AM'
  },
  {
    id: 'TX-10243',
    type: 'Investment',
    asset: 'Solar Farm Alpha TX',
    investor: 'Sofia Andersson',
    amount: '$35,000',
    fee: '$350',
    status: 'Processing',
    date: '05/02/2026 08:30 AM'
  },
  {
    id: 'TX-10242',
    type: 'Withdrawal',
    asset: 'Copper Mining Royalty',
    investor: 'Marcus Chen',
    amount: '$12,000',
    fee: '$120',
    status: 'Completed',
    date: '05/01/2026 04:22 PM'
  },
  {
    id: 'TX-10241',
    type: 'Investment',
    asset: 'Nashville Office Tower',
    investor: 'Ravi Krishnamurthy',
    amount: '$47,000',
    fee: '$470',
    status: 'Pending KYC',
    date: '05/01/2026 02:10 PM'
  },
  {
    id: 'TX-10240',
    type: 'Distribution',
    asset: 'Prime Office Tower NYC',
    investor: 'Sofia Andersson',
    amount: '$3,200',
    fee: '$0',
    status: 'Completed',
    date: '05/01/2026 08:00 AM'
  }
];

export default function TransactionsPage() {
  const [activeType, setActiveType] = useState('All');

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen pb-20">
    
      

      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50">
           <h2 className="text-lg font-black text-slate-900">Recent Transactions (6)</h2>
           <p className="text-sm font-bold text-slate-400 mt-1">Monitor all platform transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">TX ID</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">TYPE</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ASSET</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">INVESTOR</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">AMOUNT</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">FEE</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-black text-slate-900 whitespace-nowrap">{tx.id}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                      tx.type === 'Investment' ? 'bg-blue-50 text-blue-600' : 
                      tx.type === 'Distribution' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                       {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-500 whitespace-nowrap">{tx.asset}</td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-500 whitespace-nowrap">{tx.investor}</td>
                  <td className="px-6 py-6 text-sm font-black text-slate-900">{tx.amount}</td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-400">{tx.fee}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                      tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                      tx.status === 'Processing' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                       {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-400 whitespace-nowrap">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
