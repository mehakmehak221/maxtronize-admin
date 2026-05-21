"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { PageEnter } from "@/components/layout/PageEnter";
import { ClientSizedChart } from "@/components/charts/ClientSizedChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useGetAnalyticsInitQuery } from "@/store";

// Mock data fallbacks for high-fidelity offline/simulation view
const mockUserGrowthData = [
  { name: "Nov", value: 780 },
  { name: "Dec", value: 880 },
  { name: "Jan", value: 1020 },
  { name: "Feb", value: 1120 },
  { name: "Mar", value: 1210 },
  { name: "Apr", value: 1280 },
];

const mockAssetPerformanceData = [
  { name: "Real Estate", value: 9.2 },
  { name: "Private Equity", value: 12.8 },
  { name: "Infrastructure", value: 8.9 },
  { name: "Commodities", value: 6.5 },
  { name: "Energy", value: 10.2 },
];

const mockKpis = [
  { label: "AVG TRANSACTION SIZE", value: "$42,580", change: "+12.4%", up: true },
  { label: "USER RETENTION RATE", value: "87.3%", change: "+3.2%", up: true },
  { label: "ASSET APPROVAL TIME", value: "3.2 days", change: "-18%", up: false },
  { label: "PLATFORM UPTIME", value: "99.97%", change: "+0.02%", up: true },
];

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9";
  const tickFill = "#94a3b8";

  const { data, error, isLoading, refetch } = useGetAnalyticsInitQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const isSimulation = useMemo(() => {
    return !!error || !data;
  }, [error, data]);

  const kpis = useMemo(() => {
    if (!isSimulation) return data?.kpis || [];
    return mockKpis;
  }, [data, isSimulation]);

  const userGrowthData = useMemo(() => {
    if (!isSimulation) return data?.userGrowth || [];
    return mockUserGrowthData;
  }, [data, isSimulation]);

  const assetPerformanceData = useMemo(() => {
    if (!isSimulation) return data?.assetPerformance || [];
    return mockAssetPerformanceData;
  }, [data, isSimulation]);

  const tooltipStyle = {
    borderRadius: "16px",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "none",
    boxShadow: isDark
      ? "0 12px 40px rgba(0,0,0,0.45)"
      : "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    fontWeight: 900,
    background: isDark ? "#0f172b" : "#ffffff",
    color: isDark ? "#f8fafc" : "#0f172a",
  };

  return (
    <PageEnter className="p-4 md:p-8 space-y-8 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[var(--shell-card)] p-4 md:p-6 rounded-2xl border border-[var(--shell-card-border)] transition-colors duration-200">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--foreground)]">
            Advanced Analytics
          </h1>
          <p className="text-xs md:text-sm font-bold text-[var(--shell-muted)] mt-1">
            System performance, user traction analytics, and yield statistics
          </p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((stat, i) => (
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
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-[var(--foreground)]">
                {stat.value}
              </h3>
              <div
                className={`flex items-center gap-1 text-[11px] font-black ${stat.up ? "text-emerald-500" : "text-rose-500"}`}
              >
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="min-w-0 bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none transition-colors duration-200"
        >
          <div className="mb-10">
            <h2 className="text-lg font-black text-[var(--foreground)]">User Growth</h2>
            <p className="text-xs font-bold text-[var(--shell-muted)] mt-1">
              Monthly active users • Last 6 months
            </p>
          </div>
          <ClientSizedChart className="h-[300px] w-full min-h-[200px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickFill, fontSize: 11, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickFill, fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{
                    fill: "#10B981",
                    strokeWidth: 2,
                    r: 4,
                    stroke: isDark ? "#0f172b" : "#fff",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ClientSizedChart>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.4 }}
          className="min-w-0 bg-[var(--shell-card)] p-8 rounded-[32px] border border-[var(--shell-card-border)] shadow-sm dark:shadow-none transition-colors duration-200"
        >
          <div className="mb-10">
            <h2 className="text-lg font-black text-[var(--foreground)]">Asset Performance</h2>
            <p className="text-xs font-bold text-[var(--shell-muted)] mt-1">
              Avg return by asset category
            </p>
          </div>
          <ClientSizedChart className="h-[300px] w-full min-h-[200px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickFill, fontSize: 10, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickFill, fontSize: 11, fontWeight: 700 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC" }}
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value}%`, "Return"]}
                />
                <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </ClientSizedChart>
        </motion.div>
      </div>
    </PageEnter>
  );
}
