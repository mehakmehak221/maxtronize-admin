"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  RefreshCw,
  Search,
} from "lucide-react";
import { PageEnter } from "@/components/layout/PageEnter";
import { useGetTransactionsQuery } from "@/store";

const mockTransactions = [
  { id: "TX-10245", type: "Investment", asset: "Prime Office Tower NYC", investor: "Marcus Chen", amount: "$50,000", fee: "$500", status: "Completed", date: "05/02/2026 10:42 AM" },
  { id: "TX-10244", type: "Distribution", asset: "Harbor Ports PE Fund", investor: "Aisha Okonkwo", amount: "$8,400", fee: "$0", status: "Completed", date: "05/02/2026 09:15 AM" },
  { id: "TX-10243", type: "Investment", asset: "Solar Farm Alpha TX", investor: "Sofia Andersson", amount: "$35,000", fee: "$350", status: "Processing", date: "05/02/2026 08:30 AM" },
  { id: "TX-10242", type: "Withdrawal", asset: "Copper Mining Royalty", investor: "Marcus Chen", amount: "$12,000", fee: "$120", status: "Completed", date: "05/01/2026 04:22 PM" },
  { id: "TX-10241", type: "Investment", asset: "Nashville Office Tower", investor: "Ravi Krishnamurthy", amount: "$47,000", fee: "$470", status: "Pending", date: "05/01/2026 02:10 PM" },
  { id: "TX-10240", type: "Distribution", asset: "Prime Office Tower NYC", investor: "Sofia Andersson", amount: "$3,200", fee: "$0", status: "Completed", date: "05/01/2026 08:00 AM" },
];

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, error, isLoading, refetch } = useGetTransactionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const isSimulation = useMemo(() => {
    return !!error || !data;
  }, [error, data]);

  const transactions = useMemo(() => {
    const list = !isSimulation ? (data || []) : mockTransactions;
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (tx) =>
        tx.id?.toLowerCase().includes(q) ||
        tx.asset?.toLowerCase().includes(q) ||
        tx.investor?.toLowerCase().includes(q) ||
        tx.type?.toLowerCase().includes(q) ||
        tx.status?.toLowerCase().includes(q)
    );
  }, [data, isSimulation, searchQuery]);

  const hasDate = useMemo(() => {
    return transactions.some((tx) => !!tx.date);
  }, [transactions]);

  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[var(--shell-card)] p-4 md:p-6 rounded-2xl border border-[var(--shell-card-border)] transition-colors duration-200">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)]">
            Platform Transactions
          </h1>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            Monitor all investment, distribution and withdrawal activity
          </p>
        </div>
        
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--shell-muted)] w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by TX ID, asset, investor or type..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] placeholder:text-[var(--shell-muted)] text-sm focus:outline-none focus:border-[var(--shell-active)] transition-colors"
        />
      </div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200"
      >
        <div className="p-8 border-b border-[var(--shell-card-border)]">
          <h2 className="text-lg font-black text-[var(--foreground)]">
            All Transactions ({transactions.length})
          </h2>
          <p className="text-sm font-bold text-[var(--shell-muted)] mt-1">
            Monitor all platform transactions
          </p>
        </div>
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold">
              No transactions found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[var(--shell-card-border)]">
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">TX ID</th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">TYPE</th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">ASSET</th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">INVESTOR</th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">AMOUNT</th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">FEE</th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">STATUS</th>
                  {hasDate && (
                    <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">DATE</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--shell-card-border)]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-[var(--shell-subtle)] transition-colors">
                    <td className="px-8 py-6 text-sm font-black text-[var(--foreground)] whitespace-nowrap">
                      {tx.id}
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${
                          tx.type === "Investment"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                            : tx.type === "Distribution"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap max-w-[200px] truncate">
                      {tx.asset}
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                      {tx.investor}
                    </td>
                    <td className="px-6 py-6 text-sm font-black text-[var(--foreground)]">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)]">
                      {tx.fee}
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${
                          tx.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : tx.status === "Processing"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    {hasDate && (
                      <td className="px-8 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                        {tx.date}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </PageEnter>
  );
}
