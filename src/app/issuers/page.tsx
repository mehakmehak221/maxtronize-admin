"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { PageEnter } from "@/components/layout/PageEnter";

const issuers = [
  {
    id: "ISS-001",
    name: "Savanna Capital Partners",
    initials: "SC",
    email: "compliance@savannacap.com",
    country: "Kenya",
    assets: "2 active • 3 pending",
    raised: "$14.9M",
    aum: "$18.2M",
    status: "Verified",
    color: "bg-blue-600",
  },
  {
    id: "ISS-002",
    name: "West Africa Infrastructure Fund",
    initials: "WA",
    email: "ops@waif.ng",
    country: "Nigeria",
    assets: "1 active • 2 pending",
    raised: "$3.9M",
    aum: "$5.0M",
    status: "Pending",
    color: "bg-blue-600",
  },
  {
    id: "ISS-003",
    name: "Nile Green Capital",
    initials: "NG",
    email: "admin@nilegreen.eg",
    country: "Egypt",
    assets: "0 active • 1 pending",
    raised: "$0.0M",
    aum: "$8.0M",
    status: "Under Review",
    color: "bg-blue-600",
  },
  {
    id: "ISS-004",
    name: "Meridian Asset Management",
    initials: "MA",
    email: "rwa@meridian.br",
    country: "Brazil",
    assets: "0 active • 1 pending",
    raised: "$0.0M",
    aum: "$6.0M",
    status: "Pending",
    color: "bg-blue-600",
  },
  {
    id: "ISS-005",
    name: "Pacific Rim Real Assets",
    initials: "PR",
    email: "tokens@pacificrim.sg",
    country: "Singapore",
    assets: "4 active • 5 pending",
    raised: "$42.1M",
    aum: "$61.0M",
    status: "Verified",
    color: "bg-blue-600",
  },
];

export default function IssuersPage() {
  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] ">
            Issuer Management (5)
          </h1>
          <p className="text-sm font-bold text-[var(--shell-muted)] mt-1">
            Monitor and manage asset issuers
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
                  ISSUER
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  EMAIL
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  COUNTRY
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ASSETS
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  RAISED
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  AUM
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  STATUS
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase  text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--shell-card-border)]">
              {issuers.map((issuer) => (
                <tr
                  key={issuer.id}
                  className="group hover:bg-[var(--shell-subtle)] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#2563EB] dark:bg-[var(--shell-active)] text-white flex items-center justify-center text-[10px] font-black">
                        {issuer.initials}
                      </div>
                      <span className="text-sm font-black text-[var(--foreground)] whitespace-nowrap">
                        {issuer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                    {issuer.email}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)]">
                    {issuer.country}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                    {issuer.assets}
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-[var(--foreground)]">
                    {issuer.raised}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)]">
                    {issuer.aum}
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase  whitespace-nowrap ${
                        issuer.status === "Verified"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                          : issuer.status === "Pending"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                      }`}
                    >
                      {issuer.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link
                      href={`/issuers/${issuer.id}`}
                      className="p-2 text-[var(--shell-muted)] hover:text-[var(--shell-active)] transition-colors inline-block"
                    >
                      <Eye size={20} />
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
