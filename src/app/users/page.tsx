"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageEnter } from "@/components/layout/PageEnter";
import { Eye, Download } from "lucide-react";

const investors = [
  {
    id: "1",
    name: "Marcus Chen",
    email: "m.chen@maxtronize.io",
    country: "United States",
    kycStatus: "Verified",
    portfolioValue: "$248,650",
    invested: "$235,000",
    joined: "01/15/2026",
    initials: "MC",
    color: "bg-[var(--shell-active)]",
  },
  {
    id: "2",
    name: "Aisha Okonkwo",
    email: "a.okonkwo@invest.ng",
    country: "Nigeria",
    kycStatus: "Verified",
    portfolioValue: "$124,800",
    invested: "$118,000",
    joined: "11/03/2025",
    initials: "AO",
    color: "bg-[var(--shell-active)]",
  },
  {
    id: "3",
    name: "Ravi Krishnamurthy",
    email: "ravi.k@infrapartners.in",
    country: "India",
    kycStatus: "Pending",
    portfolioValue: "$0",
    invested: "$0",
    joined: "04/28/2026",
    initials: "RK",
    color: "bg-[var(--shell-active)]",
  },
  {
    id: "4",
    name: "Sofia Andersson",
    email: "s.andersson@nordicap.se",
    country: "Sweden",
    kycStatus: "Verified",
    portfolioValue: "$87,500",
    invested: "$82,000",
    joined: "02/12/2026",
    initials: "SA",
    color: "bg-[var(--shell-active)]",
  },
];

export default function UsersPage() {
  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] ">
            Investor Management (4)
          </h1>
          <p className="text-sm font-bold text-[var(--shell-muted)] mt-1">
            Monitor and manage investor accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] font-bold text-sm hover:bg-[var(--shell-subtle)] transition-all shadow-sm dark:shadow-none"
          >
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--shell-card-border)]">
                <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  Investor
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  Email
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  Country
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  KYC Status
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  Portfolio Value
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  Invested
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  Joined
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase  text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--shell-card-border)]">
              {investors.map((investor) => (
                <tr
                  key={investor.id}
                  className="group hover:bg-[var(--shell-subtle)] transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full ${investor.color} flex items-center justify-center text-white font-black text-xs shadow-lg shadow-black/5`}
                      >
                        {investor.initials}
                      </div>
                      <span className="text-sm font-black text-[var(--foreground)]">
                        {investor.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[var(--shell-muted)]">
                    {investor.email}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[var(--shell-muted)]">
                    {investor.country}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase  ${
                        investor.kycStatus === "Verified"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/20"
                      }`}
                    >
                      {investor.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-[var(--foreground)]">
                    {investor.portfolioValue}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[var(--shell-muted)]">
                    {investor.invested}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[var(--shell-muted)]">
                    {investor.joined}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link
                      href={`/users/${investor.id}`}
                      className="p-2 text-[var(--shell-muted)] hover:text-[var(--shell-active)] transition-colors inline-block"
                    >
                      <Eye size={18} />
                    </Link>
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
