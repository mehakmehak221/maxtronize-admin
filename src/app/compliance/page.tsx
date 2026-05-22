"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  Lock,
  Clock,
  ChevronRight,
  X,
  FileCheck,
} from "lucide-react";
import { PageEnter } from "@/components/layout/PageEnter";
import {
  useGetComplianceInitQuery,
  useResolveComplianceIssueMutation,
  useSetComplianceIssueUnderReviewMutation,
} from "@/store";

// Mock fallbacks
const mockStats = [
  { label: "OPEN ISSUES", value: "3", sub: "High", color: "text-rose-500" },
  { label: "UNDER REVIEW", value: "2", sub: "Medium", color: "text-amber-500" },
  { label: "RESOLVED TODAY", value: "5", sub: "Low", color: "text-emerald-500" },
  { label: "COMPLIANCE SCORE", value: "94%", sub: "Excellent", color: "text-blue-500" },
];

const mockComplianceIssues = [
  {
    id: "C-001",
    type: "KYC Expiring",
    entity: "Marcus Chen",
    entityType: "Investor",
    description: "KYC document expires in 15 days",
    severity: "Medium" as const,
    date: "05/02/2026",
    status: "Open" as const,
  },
  {
    id: "C-002",
    type: "AML Alert",
    entity: "Ravi Krishnamurthy",
    entityType: "Investor",
    description: "Large transaction flagged for review",
    severity: "High" as const,
    date: "05/01/2026",
    status: "Under Review" as const,
  },
  {
    id: "C-003",
    type: "Missing Documents",
    entity: "West Africa Infrastructure Fund",
    entityType: "Issuer",
    description: "Operating license verification pending",
    severity: "High" as const,
    date: "04/30/2026",
    status: "Open" as const,
  },
  {
    id: "C-004",
    type: "Accreditation",
    entity: "Sofia Andersson",
    entityType: "Investor",
    description: "Accreditation renewal due",
    severity: "Low" as const,
    date: "04/28/2026",
    status: "Resolved" as const,
  },
  {
    id: "C-005",
    type: "Regulatory",
    entity: "Nile Green Capital",
    entityType: "Issuer",
    description: "Cross-border compliance check required",
    severity: "Medium" as const,
    date: "04/25/2026",
    status: "Under Review" as const,
  },
];

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [resolveNote, setResolveNote] = useState("");
  const [isResolvingUI, setIsResolvingUI] = useState(false);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const queryParams = useMemo(() => {
    const params: any = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedSeverity !== "ALL") params.severity = selectedSeverity;
    if (selectedStatus !== "ALL") params.status = selectedStatus;
    return params;
  }, [debouncedSearch, selectedSeverity, selectedStatus]);

  const { data, error, isLoading, refetch } = useGetComplianceInitQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const [resolveIssue, { isLoading: isResolvingAPI }] = useResolveComplianceIssueMutation();
  const [setUnderReview, { isLoading: isSettingUnderReview }] = useSetComplianceIssueUnderReviewMutation();

  const isSimulation = useMemo(() => {
    return !!error || !data;
  }, [error, data]);

  const stats = useMemo(() => {
    if (!isSimulation) return data?.stats || [];
    return mockStats;
  }, [data, isSimulation]);

  const complianceIssues = useMemo(() => {
    if (!isSimulation) return data?.issues || [];

    // Local fallback filter if simulated
    let filtered = mockComplianceIssues;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.entity.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
      );
    }
    if (selectedSeverity !== "ALL") {
      filtered = filtered.filter((i) => i.severity.toUpperCase() === selectedSeverity);
    }
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((i) => i.status.toUpperCase() === selectedStatus);
    }
    return filtered;
  }, [data, isSimulation, searchQuery, selectedSeverity, selectedStatus]);

  const activeIssue = useMemo(() => {
    const list = !isSimulation
      ? (data?.issues || [])
      : (data?.issues && data.issues.length > 0 ? data.issues : mockComplianceIssues);
    return list.find((i) => i.id === activeIssueId) || null;
  }, [data, isSimulation, activeIssueId]);

  const handleMoveToUnderReview = async (id: string) => {
    try {
      if (isSimulation) {
        alert(`[Simulation] Moved compliance issue: ${id} to Under Review`);
      } else {
        await setUnderReview(id).unwrap();
        alert(`Successfully marked issue ${id} as Under Review`);
      }
      refetch();
    } catch (err: any) {
      alert(`Operation failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIssueId || !resolveNote.trim()) return;
    try {
      if (isSimulation) {
        alert(`[Simulation] Resolved issue ${activeIssueId} with note: "${resolveNote}"`);
      } else {
        await resolveIssue({ id: activeIssueId, note: resolveNote }).unwrap();
        alert(`Successfully resolved issue ${activeIssueId}`);
      }
      setIsResolvingUI(false);
      setResolveNote("");
      setActiveIssueId(null);
      refetch();
    } catch (err: any) {
      alert(`Resolution failed: ${err?.data?.message || err.message || "Unknown error"}`);
    }
  };

  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[var(--shell-card)] p-4 md:p-6 rounded-2xl border border-[var(--shell-card-border)] transition-colors duration-200">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)]">
            Compliance &amp; AML Risk
          </h1>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            Real-time Anti-Money Laundering telemetry and identity verification dashboards
          </p>
        </div>
        
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.06, duration: 0.35 }}
            className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none transition-colors duration-200"
          >
            <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase mb-4">
              {stat.label}
            </p>
            <h3 className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</h3>
            <p className="text-xs font-bold text-[var(--shell-muted)]">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--shell-muted)] w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues by ID, entity or keyword..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] placeholder:text-[var(--shell-muted)] text-sm focus:outline-none focus:border-[var(--shell-active)] transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-3 overflow-x-auto no-scrollbar">
          {/* Status Select */}
          <div className="flex gap-2 bg-[var(--shell-card)] border border-[var(--shell-card-border)] p-1 rounded-xl">
            {["ALL", "OPEN", "UNDER REVIEW", "RESOLVED"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all shrink-0 ${
                  selectedStatus === status
                    ? "bg-[var(--shell-active)] text-white"
                    : "text-[var(--shell-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Severity Select */}
          <div className="flex gap-2 bg-[var(--shell-card)] border border-[var(--shell-card-border)] p-1 rounded-xl">
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all shrink-0 ${
                  selectedSeverity === sev
                    ? "bg-[var(--shell-active)] text-white"
                    : "text-[var(--shell-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Issues List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200"
      >
        <div className="p-8 border-b border-[var(--shell-card-border)]">
          <h2 className="text-lg font-black text-[var(--foreground)]">
            Compliance Issues ({complianceIssues.length})
          </h2>
          <p className="text-sm font-bold text-[var(--shell-muted)] mt-1">
            Review alerts and apply system interventions
          </p>
        </div>
        <div className="overflow-x-auto">
          {complianceIssues.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold">
              No compliance issues found. All operations aligned.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[var(--shell-card-border)]">
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    ISSUE ID
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    TYPE
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    ENTITY
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    DESCRIPTION
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    SEVERITY
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase">
                    DATE
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase text-right">
                    STATUS / ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--shell-card-border)]">
                {complianceIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => {
                      setActiveIssueId(issue.id);
                      setIsResolvingUI(false);
                    }}
                    className="group hover:bg-[var(--shell-subtle)] transition-colors cursor-pointer"
                  >
                    <td className="px-8 py-6 text-sm font-black text-[var(--foreground)] whitespace-nowrap">
                      {issue.id}
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 text-[10px] font-black uppercase whitespace-nowrap">
                        {issue.type}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-black text-[var(--foreground)]">{issue.entity}</p>
                      <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase">
                        {issue.entityType}
                      </p>
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)]">
                      {issue.description}
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${
                          issue.severity === "High"
                            ? "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
                            : issue.severity === "Medium"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)]">
                      {issue.date}
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end items-center gap-3">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${
                            issue.status === "Resolved"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                              : issue.status === "Open"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                          }`}
                        >
                          {issue.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveIssueId(issue.id);
                            setIsResolvingUI(false);
                          }}
                          className="p-2 text-[var(--shell-muted)] hover:text-white rounded-lg hover:bg-slate-800"
                        >
                          <ChevronRight size={16} />
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

      {/* Compliance Issue Intervention Details Drawer/Modal */}
      <AnimatePresence>
        {activeIssueId && activeIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIssueId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[var(--shell-card)] border border-[var(--shell-card-border)] rounded-3xl p-6 md:p-8 shadow-2xl z-10 text-left"
            >
              <button
                type="button"
                onClick={() => setActiveIssueId(null)}
                className="absolute right-6 top-6 text-slate-500 hover:text-slate-300"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg font-black text-[var(--foreground)] mb-1 flex items-center gap-2">
                <FileCheck className="text-indigo-500" />
                Compliance Issue INTERVENTION
              </h3>
              <p className="text-xs text-[var(--shell-muted)] font-bold mb-6">
                ID: {activeIssue.id} • Action required by Compliance Officer
              </p>

              <div className="bg-[var(--shell-inset)] border border-[var(--shell-card-border)] rounded-2xl p-5 space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-black text-[var(--shell-muted)] uppercase block">Type</span>
                    <span className="text-xs font-black text-[var(--foreground)]">{activeIssue.type}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-[var(--shell-muted)] uppercase block">Severity</span>
                    <span className="text-xs font-black text-rose-500">{activeIssue.severity}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-[var(--shell-muted)] uppercase block">Entity</span>
                    <span className="text-xs font-black text-[var(--foreground)]">
                      {activeIssue.entity} ({activeIssue.entityType})
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-[var(--shell-muted)] uppercase block">Alert Date</span>
                    <span className="text-xs font-black text-[var(--foreground)]">{activeIssue.date}</span>
                  </div>
                </div>
                <div className="border-t border-[var(--shell-card-border)] pt-3">
                  <span className="text-[9px] font-black text-[var(--shell-muted)] uppercase block">Description</span>
                  <span className="text-sm text-[var(--foreground)] font-bold leading-normal">
                    {activeIssue.description}
                  </span>
                </div>
              </div>

              {!isResolvingUI ? (
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveIssueId(null)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--shell-card-border)] text-sm font-bold hover:bg-[var(--shell-subtle)] text-[var(--foreground)]"
                  >
                    Close
                  </button>
                  {activeIssue.status !== "Under Review" && activeIssue.status !== "Resolved" && (
                    <button
                      type="button"
                      onClick={() => handleMoveToUnderReview(activeIssue.id)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/20"
                    >
                      <Clock size={16} />
                      Set Under Review
                    </button>
                  )}
                  {activeIssue.status !== "Resolved" && (
                    <button
                      type="button"
                      onClick={() => setIsResolvingUI(true)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20"
                    >
                      <CheckCircle2 size={16} />
                      Resolve Alert
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleResolveSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">
                      Compliance Audit Note
                    </label>
                    <textarea
                      required
                      value={resolveNote}
                      onChange={(e) => setResolveNote(e.target.value)}
                      placeholder="e.g. Verified operating licenses and AML logs. Clear to approve."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-inset)] text-[var(--foreground)] placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm font-medium"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsResolvingUI(false)}
                      className="px-4 py-2.5 rounded-xl border border-[var(--shell-card-border)] text-sm font-bold hover:bg-[var(--shell-subtle)] text-[var(--foreground)]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20"
                    >
                      <Lock size={14} />
                      Submit Resolution Note
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageEnter>
  );
}
