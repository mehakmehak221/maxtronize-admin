import { baseApi } from "./baseApi";

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  icon?: string;
  color?: string;
}

export interface RevenuePoint {
  name: string;
  value: number;
}

export interface AumAssetType {
  name: string;
  value: number;
  color?: string;
}

export interface AmlAlert {
  id: string;
  type: string;
  entity: string;
  entityType: string;
  description: string;
  severity: "High" | "Medium" | "Low";
  date: string;
  status: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  revenueData: RevenuePoint[];
  donutData: AumAssetType[];
}

export interface DashboardInitResponse {
  stats: DashboardStat[];
  revenueData: RevenuePoint[];
  donutData: AumAssetType[];
  alerts: AmlAlert[];
  totalTokenized?: string;
}

export interface DashboardMetricsResponse {
  totalAum: string;
  activeInvestors: string;
  activeIssuers: string;
  revenue: string;
  aumChange: string;
  investorsChange: string;
  issuersChange: string;
  revenueChange: string;
}

export interface PlatformMetric {
  label: string;
  value: string;
  change: string;
}

export interface RecentActivityItem {
  id: string;
  type: "Investment" | "Distribution" | "Verification" | "Intervention" | "AssetApproved" | "AssetRejected";
  asset?: string;
  entityName: string;
  amount?: string;
  date: string;
  status: string;
}

export interface VerificationSummary {
  pendingKYC: number;
  pendingAccreditation: number;
  pendingCompliance: number;
}

export interface VerificationQueueItem {
  id: string;
  name: string;
  type: "Investor" | "Issuer";
  status: "PENDING" | "UNDER_REVIEW";
  date: string;
}

function extractArray(response: any): any[] {
  if (!response) return [];
  const root = response?.data ?? response;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.assets)) return root.assets;
  if (Array.isArray(root.breakdown)) return root.breakdown;
  if (Array.isArray(root.results)) return root.results;
  if (Array.isArray(root.list)) return root.list;
  
  const arrays = Object.values(root).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  
  return [];
}

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => "/admin/dashboard-data",
      providesTags: ["Asset", "Transaction"],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        const stats: DashboardStat[] = [
          {
            label: "TOTAL AUM",
            value: "$0",
            change: "+0%",
          },
          {
            label: "ACTIVE INVESTORS",
            value: String(root?.users?.investors || 0),
            change: "+0",
          },
          {
            label: "ACTIVE ISSUERS",
            value: String(root?.users?.issuers || 0),
            change: "+0",
          },
          {
            label: "PLATFORM REVENUE",
            value: `$${root?.revenue?.totalRevenue || 0}`,
            change: "+0%",
          }
        ];
        return {
          stats,
          revenueData: root?.revenue?.monthlyRevenue || [],
          donutData: [],
        };
      }
    }),
    getDashboardAlerts: builder.query<AmlAlert[], { limit?: number } | void>({
      query: (params) => ({
        url: "/admin/dashboard/alerts",
        params: params || {},
      }),
      transformResponse: (response: any) => extractArray(response),
      providesTags: ["Compliance"],
    }),
    getAumByAssetType: builder.query<AumAssetType[], void>({
      query: () => "/admin/dashboard/aum-by-asset-type",
      transformResponse: (response: any) => extractArray(response?.breakdown || response),
      providesTags: ["Asset"],
    }),
    getCapitalVelocity: builder.query<any, { weeks?: number } | void>({
      query: (params) => ({
        url: "/admin/dashboard/capital-velocity",
        params: params || {},
      }),
      providesTags: ["Transaction"],
    }),
    getDashboardInit: builder.query<DashboardInitResponse, { period?: string } | void>({
      query: (params) => ({
        url: "/admin/dashboard/init",
        params: params || {},
      }),
      providesTags: ["Asset", "Transaction", "Compliance"],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        const stats: DashboardStat[] = [];
        
        if (root?.metrics) {
          const m = root.metrics;
          if (m.totalAum) {
            const val = m.totalAum.value;
            const formattedVal = val === 0 ? "$0" : `$${val.toLocaleString()}`;
            stats.push({
              label: "TOTAL AUM",
              value: formattedVal,
              change: m.totalAum.changePercent !== null && m.totalAum.changePercent !== undefined
                ? `${m.totalAum.changePercent >= 0 ? "+" : ""}${m.totalAum.changePercent}%`
                : "—",
            });
          }
          if (m.activeInvestors) {
            stats.push({
              label: "ACTIVE INVESTORS",
              value: String(m.activeInvestors.value),
              change: m.activeInvestors.changeLabel || "—",
            });
          }
          if (m.activeIssuers) {
            stats.push({
              label: "ACTIVE ISSUERS",
              value: String(m.activeIssuers.value),
              change: m.activeIssuers.changeLabel || "—",
            });
          }
          if (m.platformRevenue) {
            const val = m.platformRevenue.value;
            const formattedVal = val === 0 ? "$0" : `$${val.toLocaleString()}`;
            stats.push({
              label: "PLATFORM REVENUE",
              value: formattedVal,
              change: m.platformRevenue.changePercent !== null && m.platformRevenue.changePercent !== undefined
                ? `${m.platformRevenue.changePercent >= 0 ? "+" : ""}${m.platformRevenue.changePercent}%`
                : "—",
            });
          }
        }

        let revenueData: RevenuePoint[] = [];
        if (root?.revenuePayouts?.series) {
          revenueData = root.revenuePayouts.series.map((item: any) => ({
            name: item.month,
            value: item.revenue || 0,
            payouts: item.payouts || 0,
          }));
        }

        let donutData: AumAssetType[] = [];
        let totalTokenized = "$0M";
        if (root?.aumByAssetType) {
          if (root.aumByAssetType.totalTokenized) {
            totalTokenized = `$${(root.aumByAssetType.totalTokenized / 1000000).toFixed(1)}M`;
          }
          if (root.aumByAssetType.breakdown) {
            donutData = root.aumByAssetType.breakdown.map((item: any) => ({
              name: item.label || item.category || item.name || "Other",
              value: item.amount || item.value || 0,
            }));
          }
        }

        let alerts: AmlAlert[] = [];
        if (root?.alerts) {
          alerts = root.alerts.map((item: any) => ({
            id: item.id || "",
            type: item.type || "Alert",
            entity: item.entityName || item.entity || "Unknown",
            entityType: item.entityRole || item.entityType || "User",
            description: item.description || "",
            severity: item.severity || "Low",
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
            status: item.status || "Open",
          }));
        }

        return {
          stats,
          revenueData,
          donutData,
          alerts,
          totalTokenized,
        };
      }
    }),
    getDashboardMetrics: builder.query<DashboardMetricsResponse, void>({
      query: () => "/admin/dashboard/metrics",
      providesTags: ["Asset", "Transaction", "User"],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        return {
          totalAum: root?.totalAum?.value === 0 ? "$0" : `$${root?.totalAum?.value?.toLocaleString()}`,
          activeInvestors: String(root?.activeInvestors?.value || 0),
          activeIssuers: String(root?.activeIssuers?.value || 0),
          revenue: root?.platformRevenue?.value === 0 ? "$0" : `$${root?.platformRevenue?.value?.toLocaleString()}`,
          aumChange: root?.totalAum?.changePercent !== null && root?.totalAum?.changePercent !== undefined
            ? `${root?.totalAum?.changePercent >= 0 ? "+" : ""}${root?.totalAum?.changePercent}%`
            : "—",
          investorsChange: root?.activeInvestors?.changeLabel || "—",
          issuersChange: root?.activeIssuers?.changeLabel || "—",
          revenueChange: root?.platformRevenue?.changePercent !== null && root?.platformRevenue?.changePercent !== undefined
            ? `${root?.platformRevenue?.changePercent >= 0 ? "+" : ""}${root?.platformRevenue?.changePercent}%`
            : "—",
        };
      }
    }),
    getPlatformMetrics: builder.query<PlatformMetric[], void>({
      query: () => "/admin/dashboard/platform-metrics",
      providesTags: ["Asset", "Transaction"],
    }),
    getRecentActivity: builder.query<RecentActivityItem[], { limit?: number } | void>({
      query: (params) => ({
        url: "/admin/dashboard/recent-activity",
        params: params || {},
      }),
      transformResponse: (response: any) => extractArray(response),
      providesTags: ["Transaction", "User"],
    }),
    getRevenue: builder.query<RevenuePoint[], { period?: string } | void>({
      query: (params) => ({
        url: "/admin/dashboard/revenue",
        params: params || {},
      }),
      transformResponse: (response: any) => extractArray(response?.series || response),
      providesTags: ["Transaction"],
    }),
    getRevenuePayouts: builder.query<any, { year?: number } | void>({
      query: (params) => ({
        url: "/admin/dashboard/revenue-payouts",
        params: params || {},
      }),
      providesTags: ["Transaction"],
    }),
    getDashboardSummary: builder.query<any, void>({
      query: () => "/admin/dashboard/summary",
      providesTags: ["Asset", "Transaction"],
    }),
    getVerification: builder.query<VerificationSummary, void>({
      query: () => "/admin/dashboard/verification",
      providesTags: ["User"],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        return {
          pendingKYC: root?.kyc?.pending || 0,
          pendingAccreditation: 0,
          pendingCompliance: root?.kyb?.pending || 0,
        };
      }
    }),
    getVerificationQueue: builder.query<VerificationQueueItem[], { limit?: number } | void>({
      query: (params) => ({
        url: "/admin/dashboard/verification-queue",
        params: params || {},
      }),
      providesTags: ["User"],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        const queue: VerificationQueueItem[] = [];
        if (root?.kyc) {
          root.kyc.forEach((item: any) => {
            queue.push({
              id: item.userId || "",
              name: item.name || "Unknown",
              type: "Investor",
              status: item.status || "PENDING",
              date: item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : "",
            });
          });
        }
        if (root?.kyb) {
          root.kyb.forEach((item: any) => {
            queue.push({
              id: item.userId || item.issuerId || "",
              name: item.name || "Unknown",
              type: "Issuer",
              status: item.status || "PENDING",
              date: item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : "",
            });
          });
        }
        return queue;
      }
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetDashboardAlertsQuery,
  useGetAumByAssetTypeQuery,
  useGetCapitalVelocityQuery,
  useGetDashboardInitQuery,
  useGetDashboardMetricsQuery,
  useGetPlatformMetricsQuery,
  useGetRecentActivityQuery,
  useGetRevenueQuery,
  useGetRevenuePayoutsQuery,
  useGetDashboardSummaryQuery,
  useGetVerificationQuery,
  useGetVerificationQueueQuery,
} = dashboardApi;
