"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  XCircle,
  Building2,
  MapPin,
  Mail,
  Globe,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  User,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RefreshCw,
  X,
} from "lucide-react";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { PageEnter } from "@/components/layout/PageEnter";
import { ClientSizedChart } from "@/components/charts/ClientSizedChart";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  useGetIssuerInitQuery,
  useActivateIssuerMutation,
  useSuspendIssuerMutation,
  useApproveIssuerKybMutation,
  useRejectIssuerKybMutation,
  useSetIssuerKybUnderReviewMutation,
} from "@/store";

// High fidelity mock fallbacks
const mockIssuerData = {
  id: "ISS-001",
  name: "Savanna Capital Partners",
  location: "Kenya",
  regNumber: "CPB/123/2024",
  status: "Verified",
  joined: "10/12/2025",
  bio: "Leading real estate investment firm specializing in commercial properties across East Africa. 15+ years of experience in property development and asset management.",
  contact: {
    email: "compliance@savannacap.com",
    phone: "+254 20 1234567",
    website: "www.savannacap.com",
  },
  stats: {
    totalRaised: "$14.9M",
    aum: "$18.2M",
    totalInvestors: 487,
    avgYield: "9.2%",
  },
  assetSummary: {
    active: 2,
    submitted: 3,
    approved: 2,
    rejected: 0,
  },
  personnel: [
    { name: "James Mwangi", role: "CEO", verified: true },
    { name: "Sarah Otieno", role: "CFO", verified: true },
    { name: "David Kamau", role: "Legal Counsel", verified: true },
  ],
  assets: [
    { id: "AS-001", name: "Nairobi Tech Hub", type: "Real Estate", amount: "$3.5M", date: "04/15/2026", status: "Under Review" },
    { id: "AS-002", name: "Mombasa Logistics Center", type: "Real Estate", amount: "$2.8M", date: "03/22/2026", status: "Approved" },
    { id: "AS-003", name: "Kisumu Solar Farm", type: "Energy", amount: "$4.2M", date: "02/10/2026", status: "Active" },
    { id: "AS-004", name: "Nairobi Residential Complex", type: "Real Estate", amount: "$1.9M", date: "04/28/2026", status: "Under Review" },
    { id: "AS-005", name: "East Africa Data Center", type: "Infrastructure", amount: "$6.5M", date: "05/01/2026", status: "Under Review" },
  ],
  financials: {
    revenue: [
      { label: "Management Fees", value: "$142,000", percent: 65 },
      { label: "Performance Fees", value: "$98,000", percent: 45 },
      { label: "Admin Fees", value: "$76,000", percent: 35 },
    ],
    health: [
      { label: "Liquidity Ratio", value: "2.4x", status: "Healthy", statusColor: "text-emerald-500" },
      { label: "Debt-to-Equity", value: "0.35", status: "Good", statusColor: "text-emerald-500" },
      { label: "ROI", value: "14.2%", status: "Strong", statusColor: "text-emerald-500" },
      { label: "Operating Margin", value: "38%", status: "Excellent", statusColor: "text-emerald-500" },
      { label: "Cash Reserve", value: "$2.1M", status: "Adequate", statusColor: "text-emerald-500" },
      { label: "Credit Rating", value: "A-", status: "Good", statusColor: "text-emerald-500" },
    ],
  },
  compliance: [
    { label: "KYB Verification", desc: "Business verification completed", status: "Verified", date: "10/12/2025" },
    { label: "AML Screening", desc: "Anti-money laundering checks passed", status: "Passed", date: "10/12/2025" },
    { label: "Operating License", desc: "Valid operating license on file", status: "Active", date: "01/15/2026" },
    { label: "Insurance Coverage", desc: "Professional liability insurance current", status: "Current", date: "02/01/2026" },
  ],
  growthData: [
    { month: "Nov", value: 2000000 },
    { month: "Dec", value: 3500000 },
    { month: "Jan", value: 5500000 },
    { month: "Feb", value: 8000000 },
    { month: "Mar", value: 11000000 },
    { month: "Apr", value: 13500000 },
    { month: "May", value: 14900000 },
  ],
};

export default function IssuerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("Overview");
  const [rejectKybModalOpen, setRejectKybModalOpen] = useState(false);
  const [rejectKybReason, setRejectKybReason] = useState("");
  const tabs = ["Overview", "Assets", "Financials", "Compliance"];
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, error, isLoading, refetch } = useGetIssuerInitQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const [activateIssuer, { isLoading: isActivating }] = useActivateIssuerMutation();
  const [suspendIssuer, { isLoading: isSuspending }] = useSuspendIssuerMutation();
  const [approveKyb, { isLoading: isApprovingKyb }] = useApproveIssuerKybMutation();
  const [rejectKyb, { isLoading: isRejectingKyb }] = useRejectIssuerKybMutation();
  const [setUnderReview, { isLoading: isSettingUnderReview }] = useSetIssuerKybUnderReviewMutation();

  const isSimulation = useMemo(() => {
    return !!error || !data;
  }, [error, data]);

  const issuerData = useMemo(() => {
    if (!isSimulation) {
      const iss = (data?.issuer || {}) as any;
      return {
        id: id,
        name: iss.name || "Unknown Issuer",
        entityType: iss.entityType || "N/A",
        jurisdiction: iss.jurisdiction || "N/A",
        status: iss.status || "Pending",
        tier: iss.tier || "Standard",
        founded: iss.founded || "N/A",
        contact: iss.contact || {
          website: iss.website || "N/A",
          email: iss.email || "",
          phone: iss.phone || "",
        },
        description: iss.description || "No description available.",
        bio: iss.bio || "No biography available.",
        joined: iss.joined || "N/A",
        location: iss.location || "Unknown Location",
        regNumber: iss.regNumber || "N/A",
        assets: Array.isArray(data?.assets) ? data.assets : (Array.isArray(iss.assets) ? iss.assets : []),
        financials: {
          revenue: Array.isArray(data?.financials?.revenue) ? data.financials.revenue : (Array.isArray(iss.financials?.revenue) ? iss.financials.revenue : []),
          health: Array.isArray(data?.financials?.health) ? data.financials.health : (Array.isArray(iss.financials?.health) ? iss.financials.health : []),
        },
        compliance: Array.isArray(data?.compliance) ? data.compliance : (Array.isArray(iss.compliance) ? iss.compliance : []),
        personnel: Array.isArray(iss.personnel) ? iss.personnel : [],
        growthData: Array.isArray(iss.growthData) ? iss.growthData : [],
        stats: iss.stats || {
          totalRaised: "$0",
          aum: "$0",
          totalInvestors: 0,
          avgYield: "0%",
        },
        assetSummary: iss.assetSummary || {
          active: 0,
          submitted: 0,
          approved: 0,
          rejected: 0,
        },
      };
    }
    return { ...mockIssuerData, id };
  }, [data, id, isSimulation]);

  const isSuspended = useMemo(() => {
    return issuerData.status.toUpperCase().includes("SUSPEND");
  }, [issuerData]);

  const handleToggleStatus = async () => {
    const actionName = isSuspended ? "activate" : "suspend";
    const confirmed = confirm(
      `Are you sure you want to ${actionName} this corporate issuer: "${issuerData.name}"?`
    );
    if (!confirmed) return;
    try {
      if (isSimulation) {
        alert(`[Simulation] Toggled status for issuer: ${issuerData.name} to ${isSuspended ? "Active" : "Suspended"}`);
      } else {
        if (isSuspended) {
          await activateIssuer(id).unwrap();
        } else {
          await suspendIssuer(id).unwrap();
        }
        alert(`Successfully ${isSuspended ? "activated" : "suspended"} issuer: ${issuerData.name}`);
      }
      refetch();
    } catch (err: any) {
      alert(`Operation failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  const handleApproveKyb = async () => {
    const confirmed = confirm(`Are you sure you want to APPROVE the KYB status for corporate: "${issuerData.name}"?`);
    if (!confirmed) return;
    try {
      if (isSimulation) {
        alert(`[Simulation] Approved KYB for: ${issuerData.name}`);
      } else {
        await approveKyb(id).unwrap();
        alert(`Successfully approved corporate KYB for: ${issuerData.name}`);
      }
      refetch();
    } catch (err: any) {
      alert(`KYB approval failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  const handleSetUnderReview = async () => {
    const confirmed = confirm(`Are you sure you want to set KYB status to "Under Review" for corporate: "${issuerData.name}"?`);
    if (!confirmed) return;
    try {
      if (isSimulation) {
        alert(`[Simulation] Set KYB to Under Review for: ${issuerData.name}`);
      } else {
        await setUnderReview(id).unwrap();
        alert(`Successfully marked KYB as Under Review for: ${issuerData.name}`);
      }
      refetch();
    } catch (err: any) {
      alert(`KYB operation failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  const handleRejectKybSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectKybReason.trim()) return;
    try {
      if (isSimulation) {
        alert(`[Simulation] Rejected KYB for: ${issuerData.name} due to: "${rejectKybReason}"`);
      } else {
        await rejectKyb({ id, reason: rejectKybReason }).unwrap();
        alert(`Successfully rejected KYB for: ${issuerData.name}`);
      }
      setRejectKybModalOpen(false);
      setRejectKybReason("");
      refetch();
    } catch (err: any) {
      alert(`KYB rejection failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  const isSyncing = isLoading || isActivating || isSuspending || isApprovingKyb || isRejectingKyb || isSettingUnderReview;

  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <Link
            href="/issuers"
            className="flex items-center gap-2 text-sm font-bold text-[var(--shell-muted)] hover:text-[var(--foreground)] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Issuer Management
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 border border-violet-200 text-violet-700 dark:bg-violet-500/20 dark:border-violet-500/35 dark:text-violet-300 flex items-center justify-center shadow-sm shrink-0">
              <Building2 size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-[var(--foreground)]">{issuerData.name}</h1>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25">
                  {issuerData.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <p className="text-sm font-bold text-[var(--shell-muted)]">
                  <MapPin size={14} className="inline mr-1" /> {issuerData.location}
                </p>
                <span className="text-[var(--shell-card-border)] hidden sm:inline">•</span>
                <p className="text-sm font-bold text-[var(--shell-muted)]">{issuerData.regNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          <ThemeToggleButton compact />
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] font-bold text-sm hover:bg-[var(--shell-subtle)] transition-all shadow-sm dark:shadow-none dark:bg-transparent dark:border-white/20 dark:hover:bg-white/[0.06]"
          >
            <Download size={18} />
            Export Report
          </button>
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-lg ${
              isSuspended
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10"
                : "bg-rose-600 hover:bg-rose-500 shadow-rose-500/10"
            }`}
          >
            {isSuspended ? (
              <>
                <CheckCircle2 size={18} />
                Activate Issuer
              </>
            ) : (
              <>
                <XCircle size={18} />
                Suspend Issuer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--shell-card-border)]">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab: string) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-black transition-all relative flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab
                  ? "text-[var(--shell-active)]"
                  : "text-[var(--shell-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab}
              {tab === "Assets" && (
                <span className="bg-[var(--shell-active)] text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem]">
                  {issuerData.assets.length}
                </span>
              )}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeIssuerTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--shell-active)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === "Overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "TOTAL RAISED", value: issuerData.stats.totalRaised, icon: DollarSign, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-500/15" },
                { label: "AUM", value: issuerData.stats.aum, icon: TrendingUp, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/15" },
                { label: "TOTAL INVESTORS", value: issuerData.stats.totalInvestors, icon: User, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/15" },
                { label: "AVG. YIELD", value: issuerData.stats.avgYield, icon: Activity, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-500/15" },
              ].map((stat: any) => (
                <div
                  key={stat.label}
                  className="bg-[var(--shell-card)] p-6 rounded-[28px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}
                  >
                    <stat.icon size={22} />
                  </div>
                  <p className="text-[11px] font-bold text-[var(--shell-muted)] uppercase mb-2">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-black text-[var(--foreground)]">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-[var(--foreground)] mb-4">Company Information</h2>
                    <p className="text-[var(--shell-muted)] leading-relaxed font-medium">
                      {issuerData.bio}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]">
                      <Mail size={16} className="text-[var(--shell-muted)]" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase">
                          Email
                        </p>
                        <p className="text-xs font-black text-[var(--foreground)] truncate">
                          {issuerData.contact.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]">
                      <Phone size={16} className="text-[var(--shell-muted)]" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase">
                          Phone
                        </p>
                        <p className="text-xs font-black text-[var(--foreground)]">
                          {issuerData.contact.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]">
                      <Globe size={16} className="text-[var(--shell-muted)]" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase">
                          Website
                        </p>
                        <p className="text-xs font-black text-[var(--foreground)] truncate">
                          {issuerData.contact.website}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]">
                      <Calendar size={16} className="text-[var(--shell-muted)]" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase">
                          Joined
                        </p>
                        <p className="text-xs font-black text-[var(--foreground)]">
                          {issuerData.joined}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <p className="text-[11px] font-black text-[var(--shell-muted)] uppercase">
                      Asset Summary
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Active", value: issuerData.assetSummary.active, color: "text-emerald-500" },
                        { label: "Submitted", value: issuerData.assetSummary.submitted, color: "text-amber-500" },
                        { label: "Approved", value: issuerData.assetSummary.approved, color: "text-blue-500" },
                        { label: "Rejected", value: issuerData.assetSummary.rejected, color: "text-rose-500" },
                      ].map((stat: any) => (
                        <div
                          key={stat.label}
                          className="bg-[var(--shell-subtle)] p-5 rounded-2xl border border-[var(--shell-card-border)] text-center"
                        >
                          <p className={`text-xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
                          <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm">
                  <h2 className="text-lg font-black text-[var(--foreground)] mb-6">Growth Performance</h2>
                  <ClientSizedChart className="h-64 w-full min-h-[16rem] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={issuerData.growthData}>
                        <defs>
                          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={isDark ? 0.25 : 0.1} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke={isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"}
                        />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                          tickFormatter={(value) => `$${value / 1000000}M`}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "16px",
                            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "none",
                            boxShadow: isDark
                              ? "0 12px 40px rgba(0,0,0,0.45)"
                              : "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                            fontWeight: 900,
                            background: isDark ? "#0f172b" : "#ffffff",
                            color: isDark ? "#f8fafc" : "#0f172a",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorGrowth)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ClientSizedChart>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm">
                  <h2 className="text-lg font-black text-[var(--foreground)] mb-6">Key Personnel</h2>
                  <div className="space-y-4">
                    {issuerData.personnel.map((person: any) => (
                      <div
                        key={person.name}
                        className="flex items-center justify-between p-4 rounded-2xl bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]"
                      >
                        <div>
                          <p className="text-sm font-black text-[var(--foreground)]">{person.name}</p>
                          <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase">
                            {person.role}
                          </p>
                        </div>
                        {person.verified && <CheckCircle2 size={16} className="text-emerald-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "Assets" && (
          <motion.div
            key="assets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-[var(--shell-card-border)]">
              <h2 className="text-lg font-black text-[var(--foreground)]">
                All Assets ({issuerData.assets.length})
              </h2>
            </div>
            <div className="divide-y divide-[var(--shell-card-border)]">
              {issuerData.assets.map((asset: any) => (
                <div
                  key={asset.id}
                  className="p-8 flex items-center justify-between hover:bg-[var(--shell-subtle)] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-100 border border-violet-200 text-violet-700 dark:bg-violet-500/20 dark:border-violet-500/35 dark:text-violet-300 flex items-center justify-center">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[var(--foreground)]">{asset.name}</h3>
                      <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase mt-0.5">
                        {asset.id} • {asset.type} • {asset.amount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase mb-0.5">
                        Submitted
                      </p>
                      <p className="text-sm font-black text-[var(--foreground)]">{asset.date}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                          asset.status === "Active" || asset.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25"
                            : "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25"
                        }`}
                      >
                        {asset.status}
                      </span>
                      <ChevronRight
                        size={18}
                        className="text-[var(--shell-muted)] group-hover:text-[var(--shell-active)] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Financials" && (
          <motion.div
            key="financials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm">
               <h2 className="text-lg font-black text-[var(--foreground)] mb-8">Revenue Breakdown</h2>
               <div className="space-y-8">
                  {issuerData.financials.revenue.map((item: any) => (
                    <div key={item.label} className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[var(--shell-muted)] uppercase ">{item.label}</span>
                          <span className="text-sm font-black text-[var(--foreground)]">{item.value}</span>
                       </div>
                       <div className="h-2 w-full bg-[var(--shell-inset)] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-[var(--shell-active)] rounded-full"
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-2 bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm">
               <h2 className="text-lg font-black text-[var(--foreground)] mb-8">Financial Health Metrics</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {issuerData.financials.health.map((metric: any) => (
                    <div key={metric.label} className="p-6 rounded-[24px] bg-[var(--shell-subtle)] border border-[var(--shell-card-border)]">
                       <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase  mb-1">{metric.label}</p>
                       <h3 className="text-xl font-black text-[var(--foreground)] mb-2">{metric.value}</h3>
                       <span className={`text-[10px] font-black uppercase  ${metric.statusColor || "text-emerald-500"}`}>
                          {metric.status}
                       </span>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === "Compliance" && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* KYB Action clearance panel */}
            <div className="bg-[var(--shell-card)] p-6 md:p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-sm font-black text-[var(--foreground)] mb-1 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500" />
                  Corporate KYB onboarding interventions
                </h3>
                <p className="text-xs text-[var(--shell-muted)] font-bold">
                  Approve corporate underwriting documents, flag accounts for compliance analysis, or reject.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleApproveKyb}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-md shadow-emerald-500/10"
                >
                  <CheckCircle2 size={14} />
                  Approve KYB
                </button>
                <button
                  type="button"
                  onClick={handleSetUnderReview}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-all shadow-md shadow-amber-500/10"
                >
                  <RefreshCw size={14} />
                  KYB Under Review
                </button>
                <button
                  type="button"
                  onClick={() => setRejectKybModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-all shadow-md shadow-rose-500/10"
                >
                  <XCircle size={14} />
                  Reject KYB
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {issuerData.compliance.map((item: any) => (
                <div
                  key={item.label}
                  className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25 flex items-center justify-center">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[var(--foreground)]">{item.label}</h3>
                      <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <div className="h-px w-full bg-[var(--shell-card-border)]" />
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-[var(--shell-muted)]">
                      Last Updated: {item.date}
                    </p>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KYB Rejection Reason Modal */}
      <AnimatePresence>
        {rejectKybModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectKybModalOpen(false)}
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
                onClick={() => setRejectKybModalOpen(false)}
                className="absolute right-6 top-6 text-slate-500 hover:text-slate-300"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-black text-[var(--foreground)] mb-2 flex items-center gap-2">
                <AlertTriangle className="text-rose-500" />
                Reject Corporate KYB
              </h3>
              <p className="text-xs text-[var(--shell-muted)] font-bold mb-6">
                Please specify the reason for rejecting "{issuerData.name}"'s corporate KYB verification.
              </p>
              <form onSubmit={handleRejectKybSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Rejection Reason
                  </label>
                  <textarea
                    required
                    value={rejectKybReason}
                    onChange={(e) => setRejectKybReason(e.target.value)}
                    placeholder="e.g. Operating license document is expired."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-inset)] text-[var(--foreground)] placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors text-sm font-medium"
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectKybModalOpen(false)}
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
