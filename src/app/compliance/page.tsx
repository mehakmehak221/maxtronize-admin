"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageEnter } from "@/components/layout/PageEnter";

const complianceIssues = [
  {
    id: "C-001",
    type: "KYC Expiring",
    entity: "Marcus Chen",
    entityType: "Investor",
    description: "KYC document expires in 15 days",
    severity: "Medium",
    date: "05/02/2026",
    status: "Open",
  },
  {
    id: "C-002",
    type: "AML Alert",
    entity: "Ravi Krishnamurthy",
    entityType: "Investor",
    description: "Large transaction flagged for review",
    severity: "High",
    date: "05/01/2026",
    status: "Under Review",
  },
  {
    id: "C-003",
    type: "Missing Documents",
    entity: "West Africa Infrastructure Fund",
    entityType: "Issuer",
    description: "Operating license verification pending",
    severity: "High",
    date: "04/30/2026",
    status: "Open",
  },
  {
    id: "C-004",
    type: "Accreditation",
    entity: "Sofia Andersson",
    entityType: "Investor",
    description: "Accreditation renewal due",
    severity: "Low",
    date: "04/28/2026",
    status: "Resolved",
  },
  {
    id: "C-005",
    type: "Regulatory",
    entity: "Nile Green Capital",
    entityType: "Issuer",
    description: "Cross-border compliance check required",
    severity: "Medium",
    date: "04/25/2026",
    status: "Under Review",
  },
];

export default function CompliancePage() {
  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "OPEN ISSUES", value: "3", sub: "High", color: "text-rose-500" },
          { label: "UNDER REVIEW", value: "2", sub: "Medium", color: "text-amber-500" },
          { label: "RESOLVED TODAY", value: "5", sub: "Low", color: "text-emerald-500" },
          { label: "COMPLIANCE SCORE", value: "94%", sub: "Excellent", color: "text-blue-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.06, duration: 0.35 }}
            className="bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none transition-colors duration-200"
          >
            <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase  mb-4">
              {stat.label}
            </p>
            <h3 className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</h3>
            <p className="text-xs font-bold text-[var(--shell-muted)]">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200"
      >
        <div className="p-8 border-b border-[var(--shell-card-border)]">
          <h2 className="text-lg font-black text-[var(--foreground)]">
            Compliance Issues (5)
          </h2>
          <p className="text-sm font-bold text-[var(--shell-muted)] mt-1">
            Monitor and resolve compliance issues
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--shell-card-border)]">
                <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ISSUE ID
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  TYPE
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ENTITY
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  DESCRIPTION
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  SEVERITY
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  DATE
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--shell-card-border)]">
              {complianceIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className="group hover:bg-[var(--shell-subtle)] transition-colors"
                >
                  <td className="px-8 py-6 text-sm font-black text-[var(--foreground)] whitespace-nowrap">
                    {issue.id}
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 text-[10px] font-black uppercase  whitespace-nowrap">
                      {issue.type}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-[var(--foreground)]">{issue.entity}</p>
                    <p className="text-[10px] font-bold text-[var(--shell-muted)] uppercase ">
                      {issue.entityType}
                    </p>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)]">
                    {issue.description}
                  </td>
                  <td className="px-6 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase  whitespace-nowrap ${
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
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase  whitespace-nowrap ${
                          issue.status === "Resolved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : issue.status === "Open"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
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
