"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageEnter } from "@/components/layout/PageEnter";

const transactions = [
  {
    id: "TX-10245",
    type: "Investment",
    asset: "Prime Office Tower NYC",
    investor: "Marcus Chen",
    amount: "$50,000",
    fee: "$500",
    status: "Completed",
    date: "05/02/2026 10:42 AM",
  },
  {
    id: "TX-10244",
    type: "Distribution",
    asset: "Harbor Ports PE Fund",
    investor: "Aisha Okonkwo",
    amount: "$8,400",
    fee: "$0",
    status: "Completed",
    date: "05/02/2026 09:15 AM",
  },
  {
    id: "TX-10243",
    type: "Investment",
    asset: "Solar Farm Alpha TX",
    investor: "Sofia Andersson",
    amount: "$35,000",
    fee: "$350",
    status: "Processing",
    date: "05/02/2026 08:30 AM",
  },
  {
    id: "TX-10242",
    type: "Withdrawal",
    asset: "Copper Mining Royalty",
    investor: "Marcus Chen",
    amount: "$12,000",
    fee: "$120",
    status: "Completed",
    date: "05/01/2026 04:22 PM",
  },
  {
    id: "TX-10241",
    type: "Investment",
    asset: "Nashville Office Tower",
    investor: "Ravi Krishnamurthy",
    amount: "$47,000",
    fee: "$470",
    status: "Pending KYC",
    date: "05/01/2026 02:10 PM",
  },
  {
    id: "TX-10240",
    type: "Distribution",
    asset: "Prime Office Tower NYC",
    investor: "Sofia Andersson",
    amount: "$3,200",
    fee: "$0",
    status: "Completed",
    date: "05/01/2026 08:00 AM",
  },
];

export default function TransactionsPage() {
  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200"
      >
        <div className="p-8 border-b border-[var(--shell-card-border)]">
          <h2 className="text-lg font-black text-[var(--foreground)]">
            Recent Transactions (6)
          </h2>
          <p className="text-sm font-bold text-[var(--shell-muted)] mt-1">
            Monitor all platform transactions
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--shell-card-border)]">
                <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  TX ID
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  TYPE
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ASSET
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  INVESTOR
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  AMOUNT
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  FEE
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  STATUS
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  DATE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--shell-card-border)]">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="group hover:bg-[var(--shell-subtle)] transition-colors"
                >
                  <td className="px-8 py-6 text-sm font-black text-[var(--foreground)] whitespace-nowrap">
                    {tx.id}
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase  whitespace-nowrap ${
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
                  <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
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
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase  whitespace-nowrap ${
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
                  <td className="px-8 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                    {tx.date}
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
