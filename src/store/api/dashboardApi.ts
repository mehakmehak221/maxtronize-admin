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
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.assets)) return response.assets;
  if (Array.isArray(response.breakdown)) return response.breakdown;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.list)) return response.list;
  
  const arrays = Object.values(response).filter(Array.isArray);
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
        const stats: DashboardStat[] = [
          {
            label: "TOTAL AUM",
            value: "$0",
            change: "+0%",
          },
          {
            label: "ACTIVE INVESTORS",
            value: String(response?.users?.investors || 0),
            change: "+0",
          },
          {
            label: "ACTIVE ISSUERS",
            value: String(response?.users?.issuers || 0),
            change: "+0",
          },
          {
            label: "PLATFORM REVENUE",
            value: `$${response?.revenue?.totalRevenue || 0}`,
            change: "+0%",
          }
        ];
        return {
          stats,
          revenueData: response?.revenue?.monthlyRevenue || [],
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
        const stats: DashboardStat[] = [];
        
        if (response?.metrics) {
          const m = response.metrics;
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
        if (response?.revenuePayouts?.series) {
          revenueData = response.revenuePayouts.series.map((item: any) => ({
            name: item.month,
            value: item.revenue || 0,
            payouts: item.payouts || 0,
          }));
        }

        let donutData: AumAssetType[] = [];
        if (response?.aumByAssetType?.breakdown) {
          donutData = response.aumByAssetType.breakdown.map((item: any) => ({
            name: item.category || item.name || "Other",
            value: item.value || 0,
          }));
        }

        let alerts: AmlAlert[] = [];
        if (response?.alerts) {
          alerts = response.alerts.map((item: any) => ({
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
        };
      }
    }),
    getDashboardMetrics: builder.query<DashboardMetricsResponse, void>({
      query: () => "/admin/dashboard/metrics",
      providesTags: ["Asset", "Transaction", "User"],
      transformResponse: (response: any) => {
        return {
          totalAum: response?.totalAum?.value === 0 ? "$0" : `$${response?.totalAum?.value?.toLocaleString()}`,
          activeInvestors: String(response?.activeInvestors?.value || 0),
          activeIssuers: String(response?.activeIssuers?.value || 0),
          revenue: response?.platformRevenue?.value === 0 ? "$0" : `$${response?.platformRevenue?.value?.toLocaleString()}`,
          aumChange: response?.totalAum?.changePercent !== null && response?.totalAum?.changePercent !== undefined
            ? `${response?.totalAum?.changePercent >= 0 ? "+" : ""}${response?.totalAum?.changePercent}%`
            : "—",
          investorsChange: response?.activeInvestors?.changeLabel || "—",
          issuersChange: response?.activeIssuers?.changeLabel || "—",
          revenueChange: response?.platformRevenue?.changePercent !== null && response?.platformRevenue?.changePercent !== undefined
            ? `${response?.platformRevenue?.changePercent >= 0 ? "+" : ""}${response?.platformRevenue?.changePercent}%`
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
      transformResponse: (response: any) => ({
        pendingKYC: response?.kyc?.pending || 0,
        pendingAccreditation: 0,
        pendingCompliance: response?.kyb?.pending || 0,
      }),
    }),
    getVerificationQueue: builder.query<VerificationQueueItem[], { limit?: number } | void>({
      query: (params) => ({
        url: "/admin/dashboard/verification-queue",
        params: params || {},
      }),
      providesTags: ["User"],
      transformResponse: (response: any) => {
        const queue: VerificationQueueItem[] = [];
        if (response?.kyc) {
          response.kyc.forEach((item: any) => {
            queue.push({
              id: item.userId || "",
              name: item.name || "Unknown",
              type: "Investor",
              status: item.status || "PENDING",
              date: item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : "",
            });
          });
        }
        if (response?.kyb) {
          response.kyb.forEach((item: any) => {
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
