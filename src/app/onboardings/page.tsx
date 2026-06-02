"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { PageEnter } from "@/components/layout/PageEnter";
import {
  useApproveOnboardingMutation,
  useGetOnboardingByIdQuery,
  useGetOnboardingsQuery,
  useRejectOnboardingMutation,
  type OnboardingDetail,
  type OnboardingListItem,
} from "@/store";

const mockOnboardings: OnboardingListItem[] = [
  {
    id: "ONB-001",
    title: "Savanna Growth Estate Token",
    issuerName: "Savanna Capital Partners",
    type: "Real Estate",
    status: "PENDING",
    targetAmount: "$5.0M",
    progress: 0,
    submittedAt: "2026-05-18T09:20:00Z",
  },
  {
    id: "ONB-002",
    title: "Nile Solar Income Notes",
    issuerName: "Nile Green Capital",
    type: "Energy",
    status: "UNDER_REVIEW",
    targetAmount: "$8.2M",
    progress: 35,
    submittedAt: "2026-05-15T14:10:00Z",
  },
  {
    id: "ONB-003",
    title: "Pacific Logistics Credit Fund",
    issuerName: "Pacific Rim Real Assets",
    type: "Private Credit",
    status: "REJECTED",
    targetAmount: "$12.0M",
    progress: 100,
    submittedAt: "2026-05-11T11:00:00Z",
  },
];

const mockDetails: Record<string, OnboardingDetail> = {
  "ONB-001": {
    id: "ONB-001",
    title: "Savanna Growth Estate Token",
    description:
      "Commercial property tokenization focused on mixed-use office inventory across Nairobi growth corridors.",
    issuerId: "ISS-001",
    issuerName: "Savanna Capital Partners",
    type: "Real Estate",
    status: "PENDING",
    targetAmount: "$5.0M",
    raisedAmount: "$0",
    submittedAt: "2026-05-18T09:20:00Z",
    documents: [
      { name: "Issuer Memorandum", url: "#", type: "PDF" },
      { name: "Operating License", url: "#", type: "PDF" },
      { name: "Property Valuation", url: "#", type: "XLSX" },
    ],
  },
  "ONB-002": {
    id: "ONB-002",
    title: "Nile Solar Income Notes",
    description:
      "Yield-bearing notes backed by contracted solar receivables and regional energy infrastructure projects.",
    issuerId: "ISS-003",
    issuerName: "Nile Green Capital",
    type: "Energy",
    status: "UNDER_REVIEW",
    targetAmount: "$8.2M",
    raisedAmount: "$2.9M",
    submittedAt: "2026-05-15T14:10:00Z",
    reviewedAt: "2026-05-17T10:05:00Z",
    documents: [
      { name: "KYB Package", url: "#", type: "ZIP" },
      { name: "AML Narrative", url: "#", type: "DOCX" },
      { name: "Receivables Schedule", url: "#", type: "CSV" },
    ],
  },
  "ONB-003": {
    id: "ONB-003",
    title: "Pacific Logistics Credit Fund",
    description:
      "Warehouse-backed credit strategy targeting short-duration logistics operators across Southeast Asia.",
    issuerId: "ISS-005",
    issuerName: "Pacific Rim Real Assets",
    type: "Private Credit",
    status: "REJECTED",
    targetAmount: "$12.0M",
    raisedAmount: "$0",
    submittedAt: "2026-05-11T11:00:00Z",
    reviewedAt: "2026-05-13T08:45:00Z",
    documents: [
      { name: "Fund Deck", url: "#", type: "PDF" },
      { name: "Risk Appendix", url: "#", type: "PDF" },
    ],
  },
};

function formatStatus(status?: string) {
  return (status || "PENDING").replace(/_/g, " ");
}

function formatDate(value?: any) {
  if (!value) return "N/A";
  if (typeof value === "object") return "N/A"; // Prevent raw objects from falling through
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function canModerate(status?: string) {
  const normalized = (status || "").toUpperCase();
  return normalized === "PENDING" || normalized === "UNDER_REVIEW";
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage) return maybeMessage;

    const maybeData = (error as { data?: unknown }).data;
    if (typeof maybeData === "object" && maybeData !== null) {
      const nestedMessage = (maybeData as { message?: unknown }).message;
      if (typeof nestedMessage === "string" && nestedMessage) return nestedMessage;
    }
  }
  return "Unknown error";
}

export default function OnboardingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const {
    data,
    error,
    isLoading,
    refetch: refetchOnboardings,
  } = useGetOnboardingsQuery(
    {
      search: searchQuery || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
    },
    { refetchOnMountOrArgChange: true }
  );

  const isSimulation = useMemo(() => !!error || !data, [data, error]);

  const onboardings = useMemo(() => {
    const source = isSimulation ? mockOnboardings : data || [];
    return source.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issuerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ||
        item.status?.toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, isSimulation, searchQuery, statusFilter]);

  const resolvedSelectedId = useMemo(
    () =>
      selectedId && onboardings.some((item) => item.id === selectedId)
        ? selectedId
        : onboardings[0]?.id ?? null,
    [onboardings, selectedId]
  );

  const {
    data: selectedDetailData,
    error: selectedDetailError,
    isFetching: isFetchingDetail,
    refetch: refetchDetail,
  } = useGetOnboardingByIdQuery(resolvedSelectedId as string, {
    skip: !resolvedSelectedId,
    refetchOnMountOrArgChange: true,
  });

  const selectedDetail = useMemo(() => {
    if (!resolvedSelectedId) return null;
    if (!selectedDetailError && selectedDetailData) return selectedDetailData;
    return mockDetails[resolvedSelectedId] || null;
  }, [resolvedSelectedId, selectedDetailData, selectedDetailError]);

  const [approveOnboarding, { isLoading: isApproving }] = useApproveOnboardingMutation();
  const [rejectOnboarding, { isLoading: isRejecting }] = useRejectOnboardingMutation();

  const isWorking = isLoading || isFetchingDetail || isApproving || isRejecting;

  const handleApprove = async () => {
    if (!selectedDetail) return;
    const confirmed = confirm(
      `Approve onboarding "${selectedDetail.title}" for ${selectedDetail.issuerName}?`
    );
    if (!confirmed) return;

    try {
      if (isSimulation) {
        alert(`[Simulation] Approved onboarding: ${selectedDetail.title}`);
      } else {
        await approveOnboarding(selectedDetail.id).unwrap();
        alert(`Successfully approved onboarding: ${selectedDetail.title}`);
      }
      refetchOnboardings();
      if (resolvedSelectedId) {
        refetchDetail();
      }
    } catch (error: unknown) {
      alert(`Onboarding approval failed: ${getErrorMessage(error)}`);
    }
  };

  const handleReject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDetail || !rejectReason.trim()) return;

    try {
      if (isSimulation) {
        alert(
          `[Simulation] Rejected onboarding: ${selectedDetail.title} because "${rejectReason}"`
        );
      } else {
        await rejectOnboarding({
          id: selectedDetail.id,
          reason: rejectReason,
        }).unwrap();
        alert(`Successfully rejected onboarding: ${selectedDetail.title}`);
      }
      setRejectModalOpen(false);
      setRejectReason("");
      refetchOnboardings();
      if (resolvedSelectedId) {
        refetchDetail();
      }
    } catch (error: unknown) {
      alert(`Onboarding rejection failed: ${getErrorMessage(error)}`);
    }
  };

  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[var(--shell-card)] p-4 md:p-6 rounded-2xl border border-[var(--shell-card-border)] transition-colors duration-200">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)]">
            Onboarding Moderation
          </h1>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            Review issuer onboarding submissions, validate KYB readiness, and publish approved offerings
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            refetchOnboardings();
            if (resolvedSelectedId) {
              refetchDetail();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] font-bold text-sm hover:bg-[var(--shell-subtle)] transition-colors"
        >
          <RefreshCw size={16} className={isWorking ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--shell-muted)] w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search onboardings by issuer, offering or ID..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] text-[var(--foreground)] placeholder:text-[var(--shell-muted)] text-sm focus:outline-none focus:border-[var(--shell-active)] transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar bg-[var(--shell-card)] border border-[var(--shell-card-border)] p-1 rounded-xl">
          {["ALL", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-lg font-bold text-[10px] uppercase transition-all shrink-0 ${
                statusFilter === status
                  ? "bg-[var(--shell-active)] text-white"
                  : "text-[var(--shell-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {formatStatus(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-[var(--shell-card-border)] flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[var(--foreground)]">
                Pending and Reviewed Onboardings
              </h2>
              <p className="text-xs font-bold text-[var(--shell-muted)] mt-1">
                {onboardings.length} record{onboardings.length === 1 ? "" : "s"} loaded
              </p>
            </div>
          </div>

          <div className="divide-y divide-[var(--shell-card-border)]">
            {!onboardings.length ? (
              <div className="p-12 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto text-[var(--shell-muted)] mb-3" />
                <p className="text-sm font-bold text-[var(--shell-muted)]">
                  No onboarding submissions match the current filters.
                </p>
              </div>
            ) : (
              onboardings.map((item) => {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left px-6 py-5 transition-colors ${
                      item.id === resolvedSelectedId
                        ? "bg-[var(--shell-subtle)]"
                        : "hover:bg-[var(--shell-subtle)]/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-[var(--foreground)]">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-[var(--shell-card-border)] text-[var(--shell-muted)]">
                            {item.id}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[var(--shell-muted)]">
                          {item.issuerName} • {item.type}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap text-xs font-bold text-[var(--shell-muted)]">
                          <span>Target {item.targetAmount}</span>
                          <span>Submitted {formatDate(item.submittedAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${
                            item.status?.toUpperCase() === "APPROVED"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20"
                              : item.status?.toUpperCase() === "UNDER_REVIEW"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/20"
                                : item.status?.toUpperCase() === "REJECTED"
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200/50 dark:border-rose-500/20"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20"
                          }`}
                        >
                          {formatStatus(item.status)}
                        </span>
                        <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--shell-active)]">
                          <Eye size={14} />
                          Review
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none p-6 md:p-7"
        >
          {!selectedDetail ? (
            <div className="h-full min-h-[18rem] flex items-center justify-center text-center">
              <div>
                <FileText className="w-10 h-10 mx-auto text-[var(--shell-muted)] mb-3" />
                <p className="text-sm font-bold text-[var(--shell-muted)]">
                  Select an onboarding record to review documents and take action.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wide text-[var(--shell-muted)]">
                    Submission Detail
                  </span>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-[var(--shell-card-border)] text-[var(--shell-muted)]">
                    {selectedDetail.id}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-[var(--foreground)]">
                    {selectedDetail.title}
                  </h2>
                  <p className="text-sm font-bold text-[var(--shell-muted)] mt-1">
                    {selectedDetail.issuerName} • {selectedDetail.type}
                  </p>
                </div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${
                    selectedDetail.status?.toUpperCase() === "APPROVED"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20"
                      : selectedDetail.status?.toUpperCase() === "UNDER_REVIEW"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/50 dark:border-amber-500/20"
                        : selectedDetail.status?.toUpperCase() === "REJECTED"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200/50 dark:border-rose-500/20"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20"
                  }`}
                >
                  {formatStatus(selectedDetail.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[var(--shell-card-border)] p-4">
                  <p className="text-[10px] font-black uppercase text-[var(--shell-muted)]">Target</p>
                  <p className="text-lg font-black text-[var(--foreground)] mt-2">
                    {selectedDetail.targetAmount}
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--shell-card-border)] p-4">
                  <p className="text-[10px] font-black uppercase text-[var(--shell-muted)]">Raised</p>
                  <p className="text-lg font-black text-[var(--foreground)] mt-2">
                    {selectedDetail.raisedAmount}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-black text-[var(--foreground)]">Overview</p>
                <p className="text-[var(--shell-muted)] font-medium leading-6">
                  {selectedDetail.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-[var(--shell-card-border)] p-4">
                  <p className="text-[10px] font-black uppercase text-[var(--shell-muted)]">Submitted</p>
                  <p className="font-bold text-[var(--foreground)] mt-2">
                    {formatDate(selectedDetail.submittedAt)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--shell-card-border)] p-4">
                  <p className="text-[10px] font-black uppercase text-[var(--shell-muted)]">Reviewed</p>
                  <p className="font-bold text-[var(--foreground)] mt-2">
                    {formatDate(selectedDetail.reviewedAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-[var(--foreground)]">Documents</p>
                  <span className="text-xs font-bold text-[var(--shell-muted)]">
                    {selectedDetail.documents.length} attached
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedDetail.documents.map((document, index) => (
                    <div
                      key={`${document.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--shell-card-border)] p-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-black text-[var(--foreground)] truncate">
                          {document.name}
                        </p>
                        <p className="text-xs font-bold text-[var(--shell-muted)] mt-1">
                          {document.type}
                        </p>
                      </div>
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--shell-active)]"
                      >
                        Open
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-[28px] border border-[var(--shell-card-border)] p-5 bg-[var(--shell-subtle)]/60">
                <div>
                  <p className="font-black text-[var(--foreground)]">Moderation Actions</p>
                  <p className="text-xs font-bold text-[var(--shell-muted)] mt-1">
                    Approve to publish the marketplace asset, or reject and send the onboarding back to the issuer.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={!canModerate(selectedDetail.status) || isWorking}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={16} />
                    Approve Onboarding
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectModalOpen(true)}
                    disabled={!canModerate(selectedDetail.status) || isWorking}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={16} />
                    Reject Onboarding
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {rejectModalOpen && selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-[var(--shell-card-border)] bg-[var(--shell-card)] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--shell-card-border)]">
              <div>
                <h3 className="text-lg font-black text-[var(--foreground)]">
                  Reject Onboarding
                </h3>
                <p className="text-xs font-bold text-[var(--shell-muted)] mt-1">
                  Tell the issuer what needs to be corrected before resubmission.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isRejecting) return;
                  setRejectModalOpen(false);
                }}
                className="p-2 rounded-xl border border-[var(--shell-card-border)] text-[var(--shell-muted)] hover:text-[var(--foreground)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[var(--shell-muted)] mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={5}
                  placeholder="Explain the compliance, documentation, or KYB gaps that must be fixed."
                  className="w-full rounded-2xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--shell-muted)] focus:outline-none focus:border-[var(--shell-active)] resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--shell-card-border)] text-sm font-bold text-[var(--foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectReason.trim() || isRejecting}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageEnter>
  );
}
