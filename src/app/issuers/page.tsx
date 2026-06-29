"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  Activity,
  AlertTriangle,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { PageEnter } from "@/components/layout/PageEnter";
import { useGetIssuersQuery } from "@/store";

// Mock fallbacks for offline / unauthorized admin preview
const mockIssuers = [
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
    color: "bg-[var(--shell-active)]",
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
    color: "bg-[var(--shell-active)]",
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
    color: "bg-[var(--shell-active)]",
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
    color: "bg-[var(--shell-active)]",
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
    color: "bg-[var(--shell-active)]",
  },
];

export default function IssuersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kybFilter, setKybFilter] = useState("ALL");

  const { data, error, isLoading, refetch } = useGetIssuersQuery({
    search: searchQuery || undefined,
    kybStatus: kybFilter === "ALL" ? undefined : kybFilter,
  }, {
    refetchOnMountOrArgChange: true,
  });

  const isSimulation = useMemo(() => {
    return !!error || !data;
  }, [error, data]);

  const issuers = useMemo(() => {
    if (!isSimulation) {
      const list = data || [];
      return list.map((issuer) => ({
        ...issuer,
        initials: issuer.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?",
        color: "bg-[var(--shell-active)]",
      }));
    }
    // Sandbox filters
    let list = mockIssuers;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.country.toLowerCase().includes(q)
      );
    }
    if (kybFilter !== "ALL") {
      list = list.filter((i) => i.status.toUpperCase() === kybFilter);
    }
    return list;
  }, [data, isSimulation, searchQuery, kybFilter]);

  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[var(--shell-card)] p-4 md:p-6 rounded-2xl border border-[var(--shell-card-border)] transition-colors duration-200">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)]">
            Issuer Management ({issuers.length})
          </h1>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            Monitor and manage asset issuers, corporate onboarding, and institutional offerings
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
            placeholder="Search issuers by name, email or country..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] placeholder:text-[var(--shell-muted)] text-sm focus:outline-none focus:border-[var(--shell-active)] transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar bg-[var(--shell-card)] border border-[var(--shell-card-border)] p-1 rounded-xl">
          {["ALL", "VERIFIED", "PENDING", "UNDER_REVIEW", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setKybFilter(status)}
              className={`px-3.5 py-2 rounded-lg font-bold text-[10px] uppercase transition-all shrink-0 ${
                kybFilter === status
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
          {issuers.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold">
              No issuers found matching the criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[var(--shell-card-border)]">
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Issuer
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Email
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Country
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Assets
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Raised
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    AUM
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    Status
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--shell-card-border)]">
                {issuers.map((issuer) => (
                  <tr
                    key={issuer.id}
                    className="group hover:bg-[var(--shell-subtle)] transition-colors"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 shrink-0 rounded-full ${issuer.color} text-white flex items-center justify-center text-[10px] font-black`}
                        >
                          {issuer.initials}
                        </div>
                        <span className="text-sm font-black text-[var(--foreground)] truncate max-w-[160px]">
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
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${
                          issuer.status?.toUpperCase() === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20"
                            : issuer.status?.toUpperCase() === "PENDING"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20"
                              : issuer.status?.toUpperCase() === "UNDER_REVIEW"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/20"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200/50 dark:border-rose-500/20"
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
          )}
        </div>
      </motion.div>
    </PageEnter>
  );
}
