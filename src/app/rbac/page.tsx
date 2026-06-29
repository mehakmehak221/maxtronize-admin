"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageEnter } from "@/components/layout/PageEnter";
import { Edit2, Trash2, Plus } from "lucide-react";

const admins = [
  {
    initials: "PR",
    name: "Priya Ramamurthy",
    role: "Super Admin",
    email: "p.ramamurthy@maxtronize.io",
    permissions: ["Approve Assets", "Reject Assets"],
    extraPermissions: 2,
    accessLevel: "Full Access",
    added: "04/05/2026",
    color: "bg-[#9810FA]",
  },
  {
    initials: "DO",
    name: "David Chan",
    role: "Compliance Officer",
    email: "d.chan@maxtronize.io",
    permissions: ["Approve Assets", "Reject Assets"],
    extraPermissions: 1,
    accessLevel: "Restricted",
    added: "10/12/2025",
    color: "bg-[#9810FA]",
  },
  {
    initials: "LM",
    name: "Luna Miller",
    role: "Operations Manager",
    email: "l.miller@maxtronize.io",
    permissions: ["Manage Users", "Manage Issuers"],
    extraPermissions: 0,
    accessLevel: "View Analytics",
    added: "02/20/2026",
    color: "bg-[#9810FA]",
  },
  {
    initials: "JC",
    name: "James Chukwu",
    role: "Analytics Analyst",
    email: "j.chukwu@maxtronize.io",
    permissions: ["View Analytics"],
    extraPermissions: 0,
    accessLevel: "Analytics Only",
    added: "03/30/2026",
    color: "bg-[#9810FA]",
  },
  {
    initials: "MZ",
    name: "Mei-Lin Zhang",
    role: "Asset Reviewer",
    email: "m.zhang@maxtronize.io",
    permissions: ["Approve Assets", "Reject Assets"],
    extraPermissions: 0,
    accessLevel: "Asset Review",
    added: "04/05/2026",
    color: "bg-[#9810FA]",
  },
];

export default function RBACPage() {
  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] ">
            Admin RBAC
          </h1>
          <p className="text-sm font-bold text-[var(--shell-muted)] mt-1">
            Manage administrative roles and system permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--shell-active)] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--shell-active)]/25"
          >
            <Plus size={18} />
            Add New Admin
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--shell-card)] rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200"
      >
        <div className="p-8 border-b border-[var(--shell-card-border)]">
          <h2 className="text-lg font-black text-[var(--foreground)]">
            Admin Role Management (5)
          </h2>
          <p className="text-sm font-bold text-[var(--shell-muted)] mt-1">
            Manage admin users and permissions
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b border-[var(--shell-card-border)]">
                <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ADMIN
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ROLE
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  EMAIL
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  PERMISSIONS
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ACCESS LEVEL
                </th>
                <th className="px-6 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase ">
                  ADDED
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[var(--shell-muted)] uppercase  text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--shell-card-border)]">
              {admins.map((admin, i) => (
                <tr
                  key={i}
                  className="group hover:bg-[var(--shell-subtle)] transition-colors"
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-[#9810FA] text-white flex items-center justify-center text-[10px] font-black">
                        {admin.initials}
                      </div>
                      <span className="text-sm font-black text-[var(--foreground)] truncate max-w-[160px]">
                        {admin.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-[var(--foreground)] whitespace-nowrap">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                    {admin.email}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-2 max-w-[280px]">
                      {admin.permissions.map((perm, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-[var(--shell-active)] dark:text-white text-[10px] font-black uppercase  whitespace-nowrap"
                        >
                          {perm}
                        </span>
                      ))}
                      {admin.extraPermissions > 0 && (
                        <span className="text-[10px] font-bold text-[var(--shell-muted)] mt-1">
                          +{admin.extraPermissions}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                    {admin.accessLevel}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[var(--shell-muted)] whitespace-nowrap">
                    {admin.added}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="p-2 text-[var(--shell-muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-[var(--shell-muted)] hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
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
