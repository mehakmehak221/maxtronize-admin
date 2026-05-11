"use client";

import React, { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Globe,
  Coins,
  FileText,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { PageEnter } from "@/components/layout/PageEnter";

export default function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");

  const asset = {
    id,
    name: "Nairobi Tech Hub",
    issuer: "Savanna Capital Partners",
    type: "Real Estate",
    valuation: "$3,500,000",
    tokens: "3,500,000 MTX",
    price: "$1.00",
    compliance: "Compliant",
    risk: "Medium-Low",
    jurisdiction: "Kenya",
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Globe },
    { id: "financials", label: "Financials", icon: TrendingUp },
    { id: "compliance", label: "Compliance", icon: ShieldCheck },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <PageEnter className="p-4 md:p-8 space-y-6 md:space-y-8 min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/assets"
          className="flex items-center gap-2 text-sm font-bold text-[var(--shell-muted)] hover:text-[var(--foreground)] transition-colors group w-fit"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Admin Dashboard
        </Link>
        <ThemeToggleButton compact className="self-start sm:self-auto" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <Link
            href="/assets"
            className="p-2.5 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--shell-muted)] hover:text-[var(--foreground)] transition-all shadow-sm dark:shadow-none shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)] ">
                {asset.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase  border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25">
                Under Review
              </span>
            </div>
            <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
              {asset.id} • {asset.issuer}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--shell-card-border)] bg-transparent text-[var(--foreground)] font-bold text-sm hover:bg-[var(--shell-subtle)] transition-all"
          >
            <Download size={18} />
            Export Report
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
          >
            <CheckCircle2 size={18} />
            Approve Asset
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/15"
          >
            <XCircle size={18} />
            Reject
          </button>
        </div>
      </div>

      <div className="border-b border-[var(--shell-card-border)]">
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 md:px-5 py-3 text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[var(--shell-active)]"
                    : "text-[var(--shell-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[var(--shell-active)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-2 space-y-6 md:space-y-8">
                <div className="bg-[var(--shell-card)] p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10">
                    <h3 className="text-base md:text-lg font-black text-[var(--foreground)]">
                      Asset Tokenomics
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-[var(--shell-subtle)] text-[var(--foreground)] text-xs font-bold border border-[var(--shell-card-border)]"
                      >
                        1M
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-[var(--shell-subtle)] text-[var(--foreground)] text-xs font-bold border border-[var(--shell-card-border)]"
                      >
                        6M
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-[var(--shell-active)] text-white text-xs font-bold"
                      >
                        1Y
                      </button>
                    </div>
                  </div>
                  <div className="h-[250px] md:h-[350px] w-full bg-[var(--shell-inset)] rounded-[24px] flex items-center justify-center border border-dashed border-[var(--shell-card-border)]">
                    <div className="text-center">
                      <TrendingUp className="text-[var(--shell-muted)] w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 opacity-40" />
                      <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)]">
                        Token Performance Graph
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-[var(--shell-card)] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-6">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="text-sm font-black text-[var(--shell-muted)] uppercase  mb-1">
                      COMPLIANCE STATUS
                    </h4>
                    <p className="text-xl md:text-2xl font-black text-[var(--foreground)]">
                      {asset.compliance}
                    </p>
                  </div>
                  <div className="bg-[var(--shell-card)] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                      <AlertCircle size={20} />
                    </div>
                    <h4 className="text-sm font-black text-[var(--shell-muted)] uppercase  mb-1">
                      RISK PROFILE
                    </h4>
                    <p className="text-xl md:text-2xl font-black text-[var(--foreground)]">
                      {asset.risk}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="bg-[var(--shell-card)] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none">
                  <h3 className="text-base md:text-lg font-black text-[var(--foreground)] mb-8">
                    Asset Details
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase  mb-2">
                        Total Valuation
                      </p>
                      <p className="text-lg md:text-xl font-black text-[var(--foreground)]">
                        {asset.valuation}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-[var(--shell-card-border)]">
                      <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase  mb-2">
                        Total Token Supply
                      </p>
                      <p className="text-lg md:text-xl font-black text-[var(--foreground)]">
                        {asset.tokens}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-[var(--shell-card-border)]">
                      <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase  mb-2">
                        Current Jurisdictions
                      </p>
                      <p className="text-lg md:text-xl font-black text-[var(--foreground)]">
                        {asset.jurisdiction}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-full py-4 rounded-2xl bg-[var(--shell-active)] text-white font-black text-sm shadow-lg shadow-[var(--shell-active)]/25 flex items-center justify-center gap-3 mt-4"
                    >
                      <Download size={18} />
                      Download Report
                    </button>
                  </div>
                </div>

                <div className="bg-[var(--shell-active)] p-6 md:p-8 rounded-[24px] md:rounded-[32px] text-white shadow-xl shadow-[var(--shell-active)]/20">
                  <Coins className="w-10 h-10 md:w-12 md:h-12 mb-6 opacity-40" />
                  <h3 className="text-base md:text-lg font-black mb-2">
                    Secondary Market
                  </h3>
                  <p className="text-xs md:text-sm font-bold opacity-80 leading-relaxed mb-6">
                    Access decentralized liquidity pools for this asset on the
                    Maxtronize DEX.
                  </p>
                  <button
                    type="button"
                    className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-black text-[11px] uppercase "
                  >
                    View Liquidity Pools
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "overview" && (
            <div className="bg-[var(--shell-card)] p-10 md:p-20 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none flex flex-col items-center justify-center text-center transition-colors duration-200">
              <div className="w-20 h-20 rounded-3xl bg-[var(--shell-inset)] flex items-center justify-center text-[var(--shell-muted)] mb-8">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-black text-[var(--foreground)] mb-2">
                {tabs.find((t) => t.id === activeTab)?.label} Data
              </h3>
              <p className="text-sm font-bold text-[var(--shell-muted)] max-w-xs">
                Detailed {activeTab} information is being synchronized from the
                distributed ledger.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </PageEnter>
  );
}
