"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageEnter } from "@/components/layout/PageEnter";
import {
  Eye,
  Download,
  Activity,
  AlertTriangle,
  RefreshCw,
  Search,
} from "lucide-react";
import { useGetInvestorsQuery } from "@/store";

// Mock fallbacks for offline / unauthorized admin preview
const mockInvestors = [
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
  const [searchQuery, setSearchQuery] = useState("");
  const [kycFilter, setKycFilter] = useState("ALL");

  const { data, error, isLoading, refetch } = useGetInvestorsQuery({
    search: searchQuery || undefined,
    kycStatus: kycFilter === "ALL" ? undefined : kycFilter,
  }, {
    refetchOnMountOrArgChange: true,
  });

  const isSimulation = useMemo(() => {
    return !!error || !data;
  }, [error, data]);

  const investors = useMemo(() => {
    if (!isSimulation) {
      const list = data || [];
      return list.map((inv) => ({
        ...inv,
        initials: inv.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?",
        color: "bg-[var(--shell-active)]",
      }));
    }
    // Sandbox filters
    let list = mockInvestors;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.country.toLowerCase().includes(q)
      );
    }
    if (kycFilter !== "ALL") {
      list = list.filter((i) => i.kycStatus.toUpperCase() === kycFilter);
    }
    return list;
  }, [data, isSimulation, searchQuery, kycFilter]);

  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[var(--shell-card)] p-4 md:p-6 rounded-2xl border border-[var(--shell-card-border)] transition-colors duration-200">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)]">
            Investor Management ({investors.length})
          </h1>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            Monitor and manage investor accounts, KYC validations and active capital profiles
          </p>
        </div>
        
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--shell-muted)] w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search investors by name, email or country..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] placeholder:text-[var(--shell-muted)] text-sm focus:outline-none focus:border-[var(--shell-active)] transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar bg-[var(--shell-card)] border border-[var(--shell-card-border)] p-1 rounded-xl">
          {["ALL", "VERIFIED", "PENDING", "UNDER_REVIEW", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setKycFilter(status)}
              className={`px-3.5 py-2 rounded-lg font-bold text-[10px] uppercase transition-all shrink-0 ${
                kycFilter === status
                  ? "bg-[var(--shell-active)] text-white"
                  : "text-[var(--shell-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200"
      >
        <div className="overflow-x-auto">
          {investors.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold">
              No investors found matching the criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[var(--shell-card-border)]">
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Investor
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Email
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Country
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    KYC Status
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Portfolio Value
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Invested
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Joined
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase text-right">
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
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          investor.kycStatus?.toUpperCase() === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20"
                            : investor.kycStatus?.toUpperCase() === "PENDING"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/20"
                              : investor.kycStatus?.toUpperCase() === "UNDER_REVIEW"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200/50 dark:border-rose-500/20"
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
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/users/${investor.id}`}
                          className="p-2 text-[var(--shell-muted)] hover:text-[var(--shell-active)] transition-colors inline-block"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </td>
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
