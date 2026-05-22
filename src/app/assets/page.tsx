"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Activity,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";
import { PageEnter } from "@/components/layout/PageEnter";
import {
  useGetPendingAssetsQuery,
  useApproveAssetMutation,
  useRejectAssetMutation,
} from "@/store";

// Mock fallbacks
const mockPendingAssets = [
  {
    id: "AS-001",
    name: "Nairobi Tech Hub",
    issuer: "Savanna Capital Partners",
    type: "Real Estate",
    amount: "$3.5M",
    date: "04/15/2026",
    status: "Under Review",
  },
  {
    id: "AS-002",
    name: "Lagos Port Expansion",
    issuer: "West Africa Infrastructure Fund",
    type: "Infrastructure",
    amount: "$2.0M",
    date: "04/22/2026",
    status: "Pending",
  },
  {
    id: "AS-003",
    name: "Cairo Solar Project",
    issuer: "Nile Green Capital",
    type: "Energy",
    amount: "$8.0M",
    date: "04/28/2026",
    status: "Under Review",
  },
  {
    id: "AS-004",
    name: "São Paulo Office Tower",
    issuer: "Meridian Asset Management",
    type: "Real Estate",
    amount: "$2.1M",
    date: "05/01/2026",
    status: "Pending",
  },
];

function typePill(type: string) {
  const normType = type?.toUpperCase() || "";
  if (normType.includes("REAL") || normType.includes("ESTATE")) {
    return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300";
  }
  if (normType.includes("INFRA") || normType.includes("PORT")) {
    return "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300";
  }
  return "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300";
}

function statusPill(status: string) {
  const normStatus = status?.toUpperCase() || "";
  if (normStatus.includes("REVIEW")) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300";
  }
  if (normStatus.includes("APPROV")) {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300";
  }
  if (normStatus.includes("REJECT")) {
    return "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300";
  }
  return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
}

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [rejectAssetId, setRejectAssetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data, error, isLoading, refetch } = useGetPendingAssetsQuery({
    search: searchQuery || undefined,
    status: selectedStatus === "ALL"
      ? undefined
      : selectedStatus === "PENDING"
      ? "IN_PROGRESS"
      : selectedStatus === "UNDER REVIEW"
      ? "UNDER_REVIEW"
      : undefined,
  }, {
    refetchOnMountOrArgChange: true,
  });

  const [approveAsset, { isLoading: isApproving }] = useApproveAssetMutation();
  const [rejectAsset, { isLoading: isRejecting }] = useRejectAssetMutation();

  const isSimulation = useMemo(() => {
    return !!error || !data;
  }, [error, data]);

  const pendingAssets = useMemo(() => {
    if (!isSimulation) {
      
      let list = data || [];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(
          (a) =>
            (a.assetName || a.name)?.toLowerCase().includes(q) ||
            (a.issuerName || a.issuer as string)?.toLowerCase().includes(q) ||
            a.id?.toLowerCase().includes(q) ||
            a.assetCode?.toLowerCase().includes(q)
        );
      }
      return list;
    }
    // Simulation fallback
    let items = mockPendingAssets;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.issuer.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== "ALL") {
      items = items.filter((a) => a.status.toUpperCase() === selectedStatus);
    }
    return items;
  }, [data, isSimulation, searchQuery, selectedStatus]);

  const handleApprove = async (id: string, name: string) => {
    const confirmed = confirm(`Are you sure you want to approve "${name}" (${id})?`);
    if (!confirmed) return;
    try {
      if (isSimulation) {
        alert(`[Simulation] Approved asset: ${name}`);
      } else {
        await approveAsset(id).unwrap();
        alert(`Successfully approved asset: ${name}`);
      }
    } catch (err: any) {
      alert(`Approval failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectAssetId || !rejectReason.trim()) return;
    try {
      if (isSimulation) {
        alert(`[Simulation] Rejected asset ID: ${rejectAssetId} for reason: "${rejectReason}"`);
      } else {
        await rejectAsset({ id: rejectAssetId, reason: rejectReason }).unwrap();
        alert(`Successfully rejected asset ID: ${rejectAssetId}`);
      }
      setRejectAssetId(null);
      setRejectReason("");
    } catch (err: any) {
      alert(`Rejection failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  return (
    <PageEnter className="p-4 md:p-8 space-y-6 md:space-y-8 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[var(--shell-card)] p-4 md:p-6 rounded-2xl border border-[var(--shell-card-border)] transition-colors duration-200">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)]">
            Asset Management
          </h1>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            Validate, underwrite, approve and register new token offerings
          </p>
        </div>
        
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--shell-muted)] w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by ID, name or issuer..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] placeholder:text-[var(--shell-muted)] text-sm focus:outline-none focus:border-[var(--shell-active)] transition-colors"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {["ALL", "PENDING", "UNDER REVIEW"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-3 rounded-xl font-bold text-xs border uppercase transition-all shrink-0 ${
                selectedStatus === status
                  ? "bg-[var(--shell-active)] text-white border-[var(--shell-active)]"
                  : "bg-[var(--shell-card)] text-[var(--shell-muted)] border-[var(--shell-card-border)] hover:bg-[var(--shell-subtle)]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--shell-card)] rounded-[24px] md:rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200"
      >
        <div className="p-6 md:p-8 border-b border-[var(--shell-card-border)] flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-lg font-black text-[var(--foreground)]">
              Pending Asset Approvals ({pendingAssets.length})
            </h2>
            <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
              Review and authorize submitted tokenized assets
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] font-bold text-xs hover:bg-[var(--shell-subtle)] transition-all"
          >
            <Download size={14} />
            Export Data
          </button>
        </div>
        <div className="overflow-x-auto">
          {pendingAssets.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold">
              No pending assets found matching the criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[var(--shell-card-border)]">
                  <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    ASSET ID
                  </th>
                  <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    ASSET NAME
                  </th>
                  <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    ISSUER
                  </th>
                  <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    TYPE
                  </th>
                  <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    AMOUNT
                  </th>
                  <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    DATE
                  </th>
                  <th className="px-4 md:px-6 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    STATUS
                  </th>
                  <th className="px-6 md:px-8 py-5 md:py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase text-right">
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
                      {asset.assetCode || asset.id}
                    </td>
                    <td className="px-4 md:px-6 py-5 md:py-6">
                      <Link
                        href={`/assets/${asset.id}`}
                        className="text-sm font-black text-[var(--foreground)] hover:text-[var(--shell-active)] transition-colors whitespace-nowrap"
                      >
                        {asset.assetName || asset.name}
                      </Link>
                    </td>
                    <td className="px-4 md:px-6 py-5 md:py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                      {asset.issuerName || asset.issuer}
                    </td>
                    <td className="px-4 md:px-6 py-5 md:py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${typePill(
                          asset.assetTypeLabel || asset.assetType || asset.type
                        )}`}
                      >
                        {asset.assetTypeLabel || asset.assetType || asset.type}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-5 md:py-6 text-sm font-black text-[var(--foreground)]">
                      {asset.amount}
                    </td>
                    <td className="px-4 md:px-6 py-5 md:py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                      {asset.submittedAt ? new Date(asset.submittedAt).toLocaleDateString() : asset.date}
                    </td>
                    <td className="px-4 md:px-6 py-5 md:py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${statusPill(
                          asset.reviewStatus || asset.status
                        )}`}
                      >
                        {asset.reviewStatus || asset.status}
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
                          onClick={() => handleApprove(asset.id, asset.assetName || asset.name)}
                          className="p-2 text-emerald-500 hover:text-emerald-400 transition-colors"
                          title="Approve Asset"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectAssetId(asset.id)}
                          className="p-2 text-rose-500 hover:text-rose-400 transition-colors"
                          title="Reject Asset"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Reject Modal using AnimatePresence */}
      <AnimatePresence>
        {rejectAssetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectAssetId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[var(--shell-card)] border border-[var(--shell-card-border)] rounded-3xl p-6 md:p-8 shadow-2xl z-10 text-left"
            >
              <button
                type="button"
                onClick={() => setRejectAssetId(null)}
                className="absolute right-6 top-6 text-slate-500 hover:text-slate-300"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-black text-[var(--foreground)] mb-2 flex items-center gap-2">
                <AlertTriangle className="text-rose-500" />
                Reject Tokenized Asset Offering
              </h3>
              <p className="text-xs text-[var(--shell-muted)] font-bold mb-6">
                Specify the compliance review failure details or legal concerns.
              </p>
              <form onSubmit={handleRejectSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Rejection Reason
                  </label>
                  <textarea
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Incomplete legal documentation for the offering."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-inset)] text-[var(--foreground)] placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors text-sm font-medium"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectAssetId(null)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--shell-card-border)] text-sm font-bold hover:bg-[var(--shell-subtle)] text-[var(--foreground)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/20"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageEnter>
  );
}
