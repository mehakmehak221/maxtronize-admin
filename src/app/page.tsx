"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  Building2,
  TrendingUp,
  Activity,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { PageEnter } from "@/components/layout/PageEnter";
import { ClientSizedChart } from "@/components/charts/ClientSizedChart";
import { useGetDashboardInitQuery } from "@/store";

// High-fidelity fallback / mock data
const mockStats = [
  {
    label: "TOTAL AUM",
    value: "$42.8M",
    change: "+12.4%",
    icon: DollarSign,
    color: "#3B82F6",
  },
  {
    label: "ACTIVE INVESTORS",
    value: "1,284",
    change: "+156",
    icon: Users,
    color: "#10B981",
  },
  {
    label: "ACTIVE ISSUERS",
    value: "12",
    change: "+3",
    icon: Building2,
    color: "#7C3AED",
  },
  {
    label: "PLATFORM REVENUE",
    value: "$3.14M",
    change: "+28%",
    icon: TrendingUp,
    color: "#F97316",
  },
];

const mockRevenueData = [
  { name: "Jan", value: 150000 },
  { name: "Feb", value: 185000 },
  { name: "Mar", value: 230000 },
  { name: "Apr", value: 245000 },
  { name: "May", value: 270000 },
  { name: "Jun", value: 314000 },
];

const mockDonutData = [
  { name: "Real Estate", value: 21.0, color: "#7C3AED" },
  { name: "Private Credit", value: 8.5, color: "#6D28D9" },
  { name: "Commodities", value: 6.2, color: "#A78BFA" },
  { name: "Infrastructure", value: 4.3, color: "#C4B5FD" },
];

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const tickFill = "#94a3b8";
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9";

  const { data, error, isLoading, refetch } = useGetDashboardInitQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Automatically fall back to mock data if there's an error or if data is empty
  const isSimulation = useMemo(() => {
    return !!error || !data;
  }, [error, data]);

  const stats = useMemo(() => {
    if (!isSimulation) {
      const raw = data?.stats || [];
      return raw.map((s) => ({
        label: s.label,
        value: s.value,
        change: s.change,
        icon: s.label.toUpperCase().includes("AUM")
          ? DollarSign
          : s.label.toUpperCase().includes("INVESTOR")
            ? Users
            : s.label.toUpperCase().includes("ISSUER")
              ? Building2
              : TrendingUp,
        color: s.label.toUpperCase().includes("AUM")
          ? "#3B82F6"
          : s.label.toUpperCase().includes("INVESTOR")
            ? "#10B981"
            : s.label.toUpperCase().includes("ISSUER")
              ? "#7C3AED"
              : "#F97316",
      }));
    }
    if (data?.stats && data.stats.length > 0) {
      return data.stats.map((s) => ({
        label: s.label,
        value: s.value,
        change: s.change,
        icon: s.label.toUpperCase().includes("AUM")
          ? DollarSign
          : s.label.toUpperCase().includes("INVESTOR")
            ? Users
            : s.label.toUpperCase().includes("ISSUER")
              ? Building2
              : TrendingUp,
        color: s.label.toUpperCase().includes("AUM")
          ? "#3B82F6"
          : s.label.toUpperCase().includes("INVESTOR")
            ? "#10B981"
            : s.label.toUpperCase().includes("ISSUER")
              ? "#7C3AED"
              : "#F97316",
      }));
    }
    return mockStats;
  }, [data, isSimulation]);

  const revenueData = useMemo(() => {
    if (!isSimulation) return data?.revenueData || [];
    return data?.revenueData && data.revenueData.length > 0 ? data.revenueData : mockRevenueData;
  }, [data, isSimulation]);

  const donutData = useMemo(() => {
    const colors = ["#7C3AED", "#6D28D9", "#A78BFA", "#C4B5FD"];
    if (!isSimulation) {
      return (data?.donutData || []).map((d, index) => ({
        name: d.name,
        value: d.value,
        color: d.color || colors[index % colors.length],
      }));
    }
    if (data?.donutData && data.donutData.length > 0) {
      return data.donutData.map((d, index) => ({
        name: d.name,
        value: d.value,
        color: d.color || colors[index % colors.length],
      }));
    }
    return mockDonutData;
  }, [data, isSimulation]);

  return (
    <PageEnter className="p-4 md:p-8 space-y-6 md:space-y-8 min-h-screen pb-20">
      {/* Header Banner for Integration Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[var(--shell-card)] p-4 md:p-6 rounded-2xl border border-[var(--shell-card-border)] transition-colors duration-200">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)]">
            Admin Dashboard
          </h1>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            Real-time capital flows and digital securities ecosystem telemetry
          </p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 md:p-8 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] flex flex-col transition-colors duration-200 shadow-sm dark:shadow-none"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-black/10"
              style={{ backgroundColor: stat.color }}
            >
              <stat.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[var(--shell-muted)] uppercase mb-1.5">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h3 className="text-2xl md:text-3xl font-black text-[var(--foreground)]">
                  {stat.value}
                </h3>
                <span className="text-[11px] md:text-xs font-black text-emerald-500">
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 min-w-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 min-w-0 p-6 md:p-10 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] transition-colors duration-200 shadow-sm dark:shadow-none"
        >
          <div className="mb-8 md:mb-10">
            <h2 className="text-base md:text-xl font-black text-[var(--foreground)] mb-1.5">
              Revenue &amp; Payouts
            </h2>
            <p className="text-[11px] md:text-sm text-[var(--shell-muted)] font-bold">
              Monthly revenue &amp; partner payouts · YTD 2026
            </p>
          </div>

          <ClientSizedChart className="h-64 md:h-80 w-full min-h-[16rem] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#10B981"
                      stopOpacity={isDark ? 0.35 : 0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor="#10B981"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke={gridStroke}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: tickFill,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: tickFill,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                  tickFormatter={(val: number) =>
                    `$${(Number(val) / 1000).toFixed(0)}k`
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
                    boxShadow: isDark
                      ? "0 12px 40px rgba(0,0,0,0.45)"
                      : "0 10px 20px rgba(0,0,0,0.06)",
                    fontWeight: 900,
                    background: isDark ? "#0f172b" : "#ffffff",
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                  formatter={(val) => [
                    `$${Number(val ?? 0).toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={isDark ? 2.5 : 3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ClientSizedChart>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="min-w-0 p-6 md:p-10 rounded-xl border border-[var(--shell-card-border)] bg-[var(--shell-card)] flex flex-col transition-colors duration-200 shadow-sm dark:shadow-none"
        >
          <div className="mb-8 md:mb-10">
            <h2 className="text-base md:text-xl font-black text-[var(--foreground)] mb-1.5">
              AUM by Asset Type
            </h2>
            <p className="text-[11px] md:text-sm text-[var(--shell-muted)] font-bold">
              Total $42.0M tokenized
            </p>
          </div>

          <ClientSizedChart className="relative w-full min-h-[220px] min-w-0 aspect-square max-h-[280px] max-w-[280px] mx-auto mb-8 md:mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="90%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ClientSizedChart>

          <div className="space-y-3 md:space-y-4">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-[10px] md:text-xs font-black text-[var(--shell-muted)] uppercase truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm md:text-base font-black text-[var(--foreground)] shrink-0">
                  ${item.value}M
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageEnter>
  );
}
