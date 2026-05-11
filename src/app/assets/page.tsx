"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Download, Eye } from 'lucide-react';
import Link from 'next/link';
import { PageEnter } from '@/components/layout/PageEnter';

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

function typePill(type: string) {
  if (type === 'Real Estate') {
    return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300';
  }
  if (type === 'Infrastructure') {
    return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300';
  }
  return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300';
}

function statusPill(status: string) {
  if (status === 'Under Review') {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300';
  }
  return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300';
}

export default function AssetsPage() {
  return (
    <PageEnter className="p-4 md:p-8 space-y-6 md:space-y-8 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)] ">
            Asset Management
          </h1>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            Review and manage platform assets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] font-bold text-sm hover:bg-[var(--shell-subtle)] transition-all shadow-sm dark:shadow-none"
          >
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--shell-card)] rounded-[24px] md:rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200"
      >
        <div className="p-6 md:p-8 border-b border-[var(--shell-card-border)]">
          <h2 className="text-base md:text-lg font-black text-[var(--foreground)]">
            Pending Asset Approvals ({pendingAssets.length})
          </h2>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            Review and approve submitted assets
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--shell-card-border)]">
                <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ASSET ID
                </th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ASSET NAME
                </th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ISSUER
                </th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  TYPE
                </th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  AMOUNT
                </th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  DATE
                </th>
                <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  STATUS
                </th>
                <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase  text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--shell-card-border)]">
              {pendingAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="group hover:bg-[var(--shell-subtle)] transition-colors"
                >
                  <td className="px-6 md:px-8 py-5 md:py-6 text-sm font-black text-[var(--foreground)] whitespace-nowrap">
                    {asset.id}
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6">
                    <Link
                      href={`/assets/${asset.id}`}
                      className="text-sm font-black text-[var(--foreground)] hover:text-[var(--shell-active)] transition-colors whitespace-nowrap"
                    >
                      {asset.name}
                    </Link>
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                    {asset.issuer}
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase  whitespace-nowrap ${typePill(asset.type)}`}
                    >
                      {asset.type}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6 text-sm font-black text-[var(--foreground)]">
                    {asset.amount}
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                    {asset.date}
                  </td>
                  <td className="px-4 md:px-6 py-5 md:py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase  whitespace-nowrap ${statusPill(asset.status)}`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                    <div className="flex justify-end gap-2 md:gap-3">
                      <Link
                        href={`/assets/${asset.id}`}
                        className="p-2 text-[var(--shell-muted)] hover:text-[var(--shell-active)] transition-colors"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        type="button"
                        className="p-2 text-emerald-500 hover:text-emerald-400 transition-colors"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-rose-500 hover:text-rose-400 transition-colors"
                      >
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
    </PageEnter>
  );
}
