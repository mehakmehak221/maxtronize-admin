"use client";

import React, { use, useState, useMemo } from "react";
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
  Activity,
  AlertTriangle,
  RefreshCw,
  X,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { PageEnter } from "@/components/layout/PageEnter";
import {
  useGetAssetByIdQuery,
  useGetAssetOverviewQuery,
  useGetAssetFinancialsQuery,
  useGetAssetComplianceQuery,
  useGetAssetDocumentsQuery,
  useApproveAssetMutation,
  useRejectAssetMutation,
} from "@/store";

// Mock Fallbacks
const mockAsset = {
  id: "AS-001",
  name: "Nairobi Tech Hub",
  issuer: "Savanna Capital Partners",
  type: "Real Estate",
  valuation: "$3,500,000",
  tokens: "3,500,000 MTX",
  price: "$1.00",
  compliance: "Compliant",
  risk: "Medium-Low",
  jurisdiction: "Kenya",
  status: "Under Review",
};

const mockFinancials = {
  valuation: "$3,500,000",
  targetRaise: "$3,000,000",
  minimumInvestment: "$10,000",
  annualReturn: "12.5%",
  distributionFrequency: "Quarterly",
};

const mockCompliance = {
  id: "C-001",
  complianceScore: 96,
  status: "Compliant",
  details: "Passed all regulatory checkmarks including KYC/AML verification.",
  issues: [
    { id: "ISS-01", type: "KYC Review", description: "Investor documents verified", status: "Resolved" },
    { id: "ISS-02", type: "Sanctions Screening", description: "Entity verified against OFAC listing", status: "Resolved" },
  ],
};

const mockDocuments = [
  { id: "DOC-01", name: "Offering Memorandum", type: "PDF", uploadedAt: "04/10/2026", status: "Verified", url: "#" },
  { id: "DOC-02", name: "Property Title Deed", type: "PDF", uploadedAt: "04/12/2026", status: "Verified", url: "#" },
  { id: "DOC-03", name: "Tax Clearance Certificate", type: "PDF", uploadedAt: "04/14/2026", status: "Verified", url: "#" },
];

export default function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: headerData, error: headerError, refetch: refetchHeader } = useGetAssetByIdQuery(id);
  const { data: overviewData } = useGetAssetOverviewQuery(id);
  const { data: financialsData } = useGetAssetFinancialsQuery(id);
  const { data: complianceData } = useGetAssetComplianceQuery(id);
  const { data: documentsData } = useGetAssetDocumentsQuery(id);

  const [approveAsset, { isLoading: isApproving }] = useApproveAssetMutation();
  const [rejectAsset, { isLoading: isRejecting }] = useRejectAssetMutation();

  const isSimulation = useMemo(() => {
    return !!headerError || !headerData;
  }, [headerError, headerData]);

  const asset = useMemo(() => {
    if (headerData || overviewData) {
      return {
        id: headerData?.assetCode || headerData?.id || id,
        name: headerData?.title || headerData?.assetName || headerData?.name || overviewData?.title || overviewData?.assetName || overviewData?.name || "Unknown Asset",
        issuer: headerData?.issuerName || (typeof headerData?.issuer === "string" ? headerData.issuer : ((headerData?.issuer as any)?.name || "")) || overviewData?.issuerName || (typeof overviewData?.issuer === "string" ? overviewData.issuer : ((overviewData?.issuer as any)?.name || "")) || "Unknown Issuer",
        type: headerData?.assetTypeLabel || headerData?.assetType || headerData?.type || overviewData?.assetTypeLabel || "Unknown Type",
        status: headerData?.reviewStatus || headerData?.status || "Unknown Status",
        jurisdiction: overviewData?.location || overviewData?.jurisdiction || headerData?.jurisdiction || "N/A",
        valuation: overviewData?.totalValuation !== undefined ? `$${overviewData.totalValuation}` : headerData?.totalValuation !== undefined ? `$${headerData.totalValuation}` : overviewData?.valuation || headerData?.valuation || "N/A",
        tokens: overviewData?.tokenomics?.totalSupply !== undefined ? `${overviewData.tokenomics.totalSupply} MTX` : overviewData?.totalTokens !== undefined ? `${overviewData.totalTokens} MTX` : overviewData?.tokens || headerData?.tokens || "N/A",
        price: overviewData?.tokenomics?.pricePerToken !== undefined ? `$${overviewData.tokenomics.pricePerToken}` : overviewData?.price || headerData?.price || "N/A",
        compliance: overviewData?.complianceStatus || headerData?.compliance || "N/A",
        risk: overviewData?.riskProfile || headerData?.risk || "N/A",
      };
    }
    return { id, name: "Loading...", issuer: "", type: "", status: "", jurisdiction: "", valuation: "", tokens: "", price: "", compliance: "", risk: "" };
  }, [headerData, overviewData, id]);

  const financials = useMemo(() => {
    if (financialsData || headerData) {
      const summaryValuation = financialsData?.summary?.valuation?.value;
      const totalRevenue = financialsData?.summary?.totalRevenue?.value;
      const netIncome = financialsData?.summary?.netIncome?.value;
      const operatingExpenses = financialsData?.summary?.operatingExpenses?.value;
      const capitalRaisedRecent = financialsData?.capitalRaisedRecent;
      const currency = financialsData?.currency || "USD";

      return {
        valuation: summaryValuation !== undefined ? `${summaryValuation} ${currency}` : (headerData?.totalValuation !== undefined ? `$${headerData.totalValuation}` : "N/A"),
        targetRaise: headerData?.targetRaise !== undefined ? `$${headerData.targetRaise}` : "N/A",
        projectedApy: headerData?.projectedApy !== undefined && headerData?.projectedApy !== null ? `${headerData.projectedApy}%` : "N/A",
        totalRevenue: totalRevenue !== undefined ? `${totalRevenue} ${currency}` : "N/A",
        netIncome: netIncome !== undefined ? `${netIncome} ${currency}` : "N/A",
        operatingExpenses: operatingExpenses !== undefined ? `${operatingExpenses} ${currency}` : "N/A",
        capitalRaisedRecent: capitalRaisedRecent !== undefined ? `${capitalRaisedRecent} ${currency}` : "N/A",
      };
    }
    return { valuation: "N/A", targetRaise: "N/A", projectedApy: "N/A", totalRevenue: "N/A", netIncome: "N/A", operatingExpenses: "N/A", capitalRaisedRecent: "N/A" };
  }, [financialsData, headerData]);

  const compliance = useMemo(() => {
    if (complianceData) {
      const issues = (complianceData.checks || complianceData.issues || []).map((check: any) => ({
        id: check.key || check.id || Math.random().toString(),
        type: check.title || check.type || "Check",
        description: check.description || "No description",
        status: check.status || "Pending",
      }));

      const passedChecks = issues.filter((i: any) => i.status?.toLowerCase() === "passed" || i.status?.toLowerCase() === "verified");
      const score = complianceData.complianceScore !== undefined ? complianceData.complianceScore : (issues.length > 0 ? Math.round((passedChecks.length / issues.length) * 100) : 0);

      return {
        id: complianceData.id || "C-000",
        complianceScore: score,
        status: complianceData.status || "Pending",
        details: complianceData.details || "Compliance checks completed.",
        issues: issues,
      };
    }
    return { id: "C-000", complianceScore: 0, status: "Pending", details: "No compliance data available.", issues: [] };
  }, [complianceData]);

  const documents = useMemo(() => {
    if (documentsData && Array.isArray(documentsData)) return documentsData;
    if (documentsData?.data && Array.isArray(documentsData.data)) return documentsData.data;
    if (documentsData?.documents && Array.isArray(documentsData.documents)) return documentsData.documents;
    return [];
  }, [documentsData]);

  const handleApprove = async () => {
    const confirmed = confirm(`Are you sure you want to approve this asset offering: "${asset.name}"?`);
    if (!confirmed) return;
    try {
      if (isSimulation) {
        alert(`[Simulation] Approved asset: ${asset.name}`);
      } else {
        await approveAsset(id).unwrap();
        alert(`Successfully approved asset: ${asset.name}`);
      }
    } catch (err: any) {
      alert(`Approval failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    try {
      if (isSimulation) {
        alert(`[Simulation] Rejected asset: ${asset.name} for reason: "${rejectReason}"`);
      } else {
        await rejectAsset({ id, reason: rejectReason }).unwrap();
        alert(`Successfully rejected asset: ${asset.name}`);
      }
      setRejectModalOpen(false);
      setRejectReason("");
    } catch (err: any) {
      alert(`Rejection failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  const handleExportReport = () => {
    try {
      const reportData = {
        assetDetails: asset,
        financials: financials,
        compliance: compliance,
        tokenomics: overviewData?.tokenomics || {},
        projectedRevenue: overviewData?.projectedRevenue || {},
        documents: documents,
      };
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `asset_report_${asset.id || "export"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to export the report.");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Globe },
    { id: "financials", label: "Financials", icon: TrendingUp },
    { id: "compliance", label: "Compliance", icon: ShieldCheck },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <PageEnter className="p-4 md:p-8 space-y-6 md:space-y-8 min-h-screen pb-20">
      {/* Navigation & Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/assets"
          className="flex items-center gap-2 text-sm font-bold text-[var(--shell-muted)] hover:text-[var(--foreground)] transition-colors group w-fit"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Asset List
        </Link>
        <div className="flex items-center gap-3">

          <ThemeToggleButton compact />
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 bg-[var(--shell-card)] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-[var(--shell-card-border)] transition-colors duration-200">
        <div className="flex items-start gap-4">
          <Link
            href="/assets"
            className="p-2.5 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-inset)] text-[var(--shell-muted)] hover:text-[var(--foreground)] transition-all shadow-sm shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)] ">
                {asset.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25">
                {asset.status}
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
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--shell-card-border)] bg-transparent text-[var(--foreground)] font-bold text-sm hover:bg-[var(--shell-subtle)] transition-all"
          >
            <Download size={18} />
            Export Report
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
          >
            <CheckCircle2 size={18} />
            Approve Asset
          </button>
          <button
            type="button"
            onClick={() => setRejectModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/15"
          >
            <XCircle size={18} />
            Reject
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-[var(--shell-card-border)]">
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 md:px-5 py-3 text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${isActive
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

      {/* Tab Panels */}
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
                  <div className="h-[250px] md:h-[350px] w-full bg-[var(--shell-inset)] rounded-[24px] flex items-center justify-center border border-solid border-[var(--shell-card-border)] overflow-hidden relative">
                    {overviewData?.projectedRevenue?.series?.length > 0 ? (
                      <div className="absolute inset-0 p-4 md:p-6 pb-2">
                        <p className="text-xs font-black text-[var(--shell-muted)] uppercase absolute top-4 left-6 z-10">Projected Revenue</p>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={overviewData.projectedRevenue.series} margin={{ top: 40, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="month"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fill: "var(--shell-muted)", fontWeight: "bold" }}
                              dy={10}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "var(--shell-card)",
                                borderRadius: "12px",
                                border: "1px solid var(--shell-card-border)",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "var(--foreground)"
                              }}
                              itemStyle={{ color: "#10b981" }}
                              formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#10b981"
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#colorRevenue)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center">
                        <TrendingUp className="text-[var(--shell-muted)] w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 opacity-40" />
                        <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)]">
                          Token Performance Graph
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-[var(--shell-card)] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-6">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="text-sm font-black text-[var(--shell-muted)] uppercase mb-1">
                      COMPLIANCE STATUS
                    </h4>
                    <p className="text-xl md:text-2xl font-black text-[var(--foreground)]">
                      {compliance.status !== "Pending" ? compliance.status : (compliance.complianceScore >= 80 ? "Compliant" : compliance.complianceScore > 0 ? "Needs Review" : "Pending")}
                    </p>
                  </div>
                  <div className="bg-[var(--shell-card)] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                      <AlertCircle size={20} />
                    </div>
                    <h4 className="text-sm font-black text-[var(--shell-muted)] uppercase mb-1">
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
                      <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase mb-2">
                        Total Valuation
                      </p>
                      <p className="text-lg md:text-xl font-black text-[var(--foreground)]">
                        {asset.valuation}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-[var(--shell-card-border)]">
                      <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase mb-2">
                        Total Token Supply
                      </p>
                      <p className="text-lg md:text-xl font-black text-[var(--foreground)]">
                        {asset.tokens}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-[var(--shell-card-border)]">
                      <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase mb-2">
                        Current Jurisdictions
                      </p>
                      <p className="text-lg md:text-xl font-black text-[var(--foreground)]">
                        {asset.jurisdiction}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-[var(--shell-card-border)]">
                      <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase mb-2">
                        Price Per Token
                      </p>
                      <p className="text-lg md:text-xl font-black text-[var(--foreground)]">
                        {overviewData?.tokenomics?.pricePerToken !== undefined ? `$${overviewData.tokenomics.pricePerToken}` : "N/A"}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-[var(--shell-card-border)]">
                      <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase mb-2">
                        Minimum Investment
                      </p>
                      <p className="text-lg md:text-xl font-black text-[var(--foreground)]">
                        {overviewData?.tokenomics?.minInvestment !== undefined ? `$${overviewData.tokenomics.minInvestment}` : "N/A"}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-[var(--shell-card-border)]">
                      <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase mb-2">
                        Lockup Period
                      </p>
                      <p className="text-lg md:text-xl font-black text-[var(--foreground)]">
                        {overviewData?.tokenomics?.lockupPeriod || "N/A"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportReport}
                      className="w-full py-4 rounded-2xl bg-[var(--shell-active)] text-white font-black text-sm shadow-lg shadow-[var(--shell-active)]/25 flex items-center justify-center gap-3 mt-4 hover:opacity-90 transition-opacity"
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
                    className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-black text-[11px] uppercase"
                  >
                    View Liquidity Pools
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "financials" && (
            <div className="bg-[var(--shell-card)] p-8 md:p-10 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none space-y-8">
              <div>
                <h3 className="text-lg font-black text-[var(--foreground)] mb-2 flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" />
                  Financial offering particulars
                </h3>
                <p className="text-xs text-[var(--shell-muted)] font-bold">
                  Audited financial model details and yields synchronized from secure data lockers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Asset Valuation", value: financials.valuation },
                  { label: "Target Offering Raise", value: financials.targetRaise },
                  { label: "Projected APY", value: financials.projectedApy, highlight: true },
                  { label: "Total Revenue", value: financials.totalRevenue },
                  { label: "Net Income", value: financials.netIncome },
                  { label: "Operating Expenses", value: financials.operatingExpenses },
                  { label: "Recent Capital Raised", value: financials.capitalRaisedRecent },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="bg-[var(--shell-inset)] p-6 rounded-2xl border border-[var(--shell-card-border)] flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-black text-[var(--shell-muted)] uppercase mb-4">
                      {item.label}
                    </span>
                    <span
                      className={`text-xl md:text-2xl font-black ${item.highlight ? "text-emerald-500" : "text-[var(--foreground)]"
                        }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "compliance" && (
            <div className="bg-[var(--shell-card)] p-8 md:p-10 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-[var(--foreground)] mb-2 flex items-center gap-2">
                    <ShieldCheck className="text-indigo-500" />
                    Regulatory Compliance telemetry
                  </h3>
                  <p className="text-xs text-[var(--shell-muted)] font-bold">
                    Automatic AML screening, KYC status, and security compliance audit trails.
                  </p>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/25 px-4 py-2 rounded-xl text-center">
                  <p className="text-[10px] font-black text-indigo-400 uppercase">Compliance score</p>
                  <p className="text-2xl font-black text-indigo-400">{compliance.complianceScore}%</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--shell-inset)] border border-[var(--shell-card-border)]">
                <h4 className="text-xs font-black text-[var(--foreground)] mb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                  Compliance Verification Summary
                </h4>
                <p className="text-sm text-[var(--shell-muted)] font-semibold leading-relaxed">
                  {compliance.details}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-[var(--foreground)] uppercase">Audit Logs</h4>
                <div className="divide-y divide-[var(--shell-card-border)] border border-[var(--shell-card-border)] rounded-2xl overflow-hidden">
                  {compliance.issues.map((issue: any) => (
                    <div key={issue.id} className="p-4 bg-[var(--shell-card)] flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-[var(--foreground)]">{issue.type}</p>
                        <p className="text-xs text-[var(--shell-muted)] font-bold">{issue.description}</p>
                      </div>
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase">
                        <Check size={11} />
                        {issue.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="bg-[var(--shell-card)] p-8 md:p-10 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none space-y-6">
              <div>
                <h3 className="text-lg font-black text-[var(--foreground)] mb-2 flex items-center gap-2">
                  <FileText className="text-purple-500" />
                  Underwriting & Legal Documents
                </h3>
                <p className="text-xs text-[var(--shell-muted)] font-bold">
                  Immutable document hashes verified and cryptographically signed on the distributed ledger.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-5 bg-[var(--shell-inset)] rounded-2xl border border-[var(--shell-card-border)] flex items-center justify-between hover:bg-[var(--shell-subtle)] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                        <FileSpreadsheet size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[var(--foreground)]">{doc.name}</h4>
                        <p className="text-[10px] text-[var(--shell-muted)] font-bold uppercase">
                          {doc.type} • Uploaded {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase">
                        {doc.status}
                      </span>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={doc.name}
                        className="p-2 rounded-lg hover:bg-slate-800 text-[var(--shell-muted)] hover:text-white transition-colors"
                        title="Download Document"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModalOpen(false)}
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
                onClick={() => setRejectModalOpen(false)}
                className="absolute right-6 top-6 text-slate-500 hover:text-slate-300"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-black text-[var(--foreground)] mb-2 flex items-center gap-2">
                <AlertTriangle className="text-rose-500" />
                Reject Tokenized Asset
              </h3>
              <p className="text-xs text-[var(--shell-muted)] font-bold mb-6">
                Please specify the reason for rejecting "{asset.name}".
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
                    onClick={() => setRejectModalOpen(false)}
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
