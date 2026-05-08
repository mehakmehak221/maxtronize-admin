"use client";

import React from 'react';
import { motion } from 'framer-motion';

const complianceIssues = [
  { 
    id: 'C-001', 
    type: 'KYC Expiring', 
    entity: 'Marcus Chen', 
    entityType: 'Investor', 
    description: 'KYC document expires in 15 days', 
    severity: 'Medium', 
    date: '05/02/2026', 
    status: 'Open' 
  },
  { 
    id: 'C-002', 
    type: 'AML Alert', 
    entity: 'Ravi Krishnamurthy', 
    entityType: 'Investor', 
    description: 'Large transaction flagged for review', 
    severity: 'High', 
    date: '05/01/2026', 
    status: 'Under Review' 
  },
  { 
    id: 'C-003', 
    type: 'Missing Documents', 
    entity: 'West Africa Infrastructure Fund', 
    entityType: 'Issuer', 
    description: 'Operating license verification pending', 
    severity: 'High', 
    date: '04/30/2026', 
    status: 'Open' 
  },
  { 
    id: 'C-004', 
    type: 'Accreditation', 
    entity: 'Sofia Andersson', 
    entityType: 'Investor', 
    description: 'Accreditation renewal due', 
    severity: 'Low', 
    date: '04/28/2026', 
    status: 'Resolved' 
  },
  { 
    id: 'C-005', 
    type: 'Regulatory', 
    entity: 'Nile Green Capital', 
    entityType: 'Issuer', 
    description: 'Cross-border compliance check required', 
    severity: 'Medium', 
    date: '04/25/2026', 
    status: 'Under Review' 
  }
];

export default function CompliancePage() {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen pb-20">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'OPEN ISSUES', value: '3', sub: 'High', color: 'text-rose-500' },
          { label: 'UNDER REVIEW', value: '2', sub: 'Medium', color: 'text-amber-500' },
          { label: 'RESOLVED TODAY', value: '5', sub: 'Low', color: 'text-emerald-500' },
          { label: 'COMPLIANCE SCORE', value: '94%', sub: 'Excellent', color: 'text-blue-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
             <h3 className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</h3>
             <p className="text-xs font-bold text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Issues Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50">
           <h2 className="text-lg font-black text-slate-900">Compliance Issues (5)</h2>
           <p className="text-sm font-bold text-slate-400 mt-1">Monitor and resolve compliance issues</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ISSUE ID</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">TYPE</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ENTITY</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">DESCRIPTION</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">SEVERITY</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {complianceIssues.map((issue) => (
                <tr key={issue.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-black text-slate-900 whitespace-nowrap">{issue.id}</td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full bg-[#F5F3FF] text-[#9810FA] text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                       {issue.type}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-slate-900">{issue.entity}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{issue.entityType}</p>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-500">{issue.description}</td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                      issue.severity === 'High' ? 'bg-rose-50 text-rose-500' : 
                      issue.severity === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                       {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-500">{issue.date}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                        issue.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 
                        issue.status === 'Open' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                         {issue.status}
                      </span>
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
