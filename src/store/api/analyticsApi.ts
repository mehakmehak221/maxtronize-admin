import { baseApi } from "./baseApi";

// Frontend-expected interfaces
export interface AnalyticsAssetPerformance {
  name: string;
  value: number;
}

export interface AnalyticsKpi {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

export interface UserGrowthPoint {
  name: string;
  value: number;
}

export interface AnalyticsInitResponse {
  kpis: AnalyticsKpi[];
  userGrowth: UserGrowthPoint[];
  assetPerformance: AnalyticsAssetPerformance[];
}

// Backend raw response schemas
export interface BackendKpiDetail {
  value: number;
  changePercent: number | null;
  currency?: string;
  unit?: string;
  submissionsReviewed?: number;
}

export interface BackendKpis {
  avgTransactionSize: BackendKpiDetail;
  userRetentionRate: BackendKpiDetail;
  assetApprovalTime: BackendKpiDetail;
  platformUptime: BackendKpiDetail;
}

export interface BackendUserGrowthSeries {
  month: string;
  monthKey: string;
  activeUsers: number;
}

export interface BackendUserGrowthResponse {
  title: string;
  subtitle: string;
  series: BackendUserGrowthSeries[];
}

export interface BackendAssetPerformanceSeries {
  category: string;
  avgReturnPercent: number;
}

export interface BackendAssetPerformanceResponse {
  title: string;
  subtitle: string;
  series: BackendAssetPerformanceSeries[];
}

export interface BackendAnalyticsInitResponse {
  kpis: BackendKpis;
  userGrowth: BackendUserGrowthResponse;
  assetPerformance: BackendAssetPerformanceResponse;
}

// Transformation helper functions
function transformKpis(kpis: BackendKpis): AnalyticsKpi[] {
  const result: AnalyticsKpi[] = [];
  if (!kpis) return result;

  if (kpis.avgTransactionSize) {
    const item = kpis.avgTransactionSize;
    const value = item.value === 0 ? "$0" : `$${item.value.toLocaleString()}`;
    const change = item.changePercent !== null && item.changePercent !== undefined
      ? `${item.changePercent >= 0 ? "+" : ""}${item.changePercent}%`
      : "—";
    result.push({
      label: "AVG TRANSACTION SIZE",
      value,
      change,
      up: item.changePercent !== null ? item.changePercent >= 0 : true,
    });
  }

  if (kpis.userRetentionRate) {
    const item = kpis.userRetentionRate;
    const value = `${item.value}%`;
    const change = item.changePercent !== null && item.changePercent !== undefined
      ? `${item.changePercent >= 0 ? "+" : ""}${item.changePercent}%`
      : "—";
    result.push({
      label: "USER RETENTION RATE",
      value,
      change,
      up: item.changePercent !== null ? item.changePercent >= 0 : true,
    });
  }

  if (kpis.assetApprovalTime) {
    const item = kpis.assetApprovalTime;
    const value = `${item.value} days`;
    const change = item.changePercent !== null && item.changePercent !== undefined
      ? `${item.changePercent >= 0 ? "+" : ""}${item.changePercent}%`
      : "—";
    result.push({
      label: "ASSET APPROVAL TIME",
      value,
      change,
      up: item.changePercent !== null ? item.changePercent >= 0 : true,
    });
  }

  if (kpis.platformUptime) {
    const item = kpis.platformUptime;
    const value = `${item.value}%`;
    const change = item.changePercent !== null && item.changePercent !== undefined
      ? `${item.changePercent >= 0 ? "+" : ""}${item.changePercent}%`
      : "—";
    result.push({
      label: "PLATFORM UPTIME",
      value,
      change,
      up: item.changePercent !== null ? item.changePercent >= 0 : true,
    });
  }

  return result;
}

function transformUserGrowth(data: BackendUserGrowthResponse): UserGrowthPoint[] {
  if (!data?.series) return [];
  return data.series.map((item) => ({
    name: item.month,
    value: item.activeUsers,
  }));
}

function transformAssetPerformance(data: BackendAssetPerformanceResponse): AnalyticsAssetPerformance[] {
  if (!data?.series) return [];
  return data.series.map((item) => ({
    name: item.category,
    value: item.avgReturnPercent,
  }));
}

export const analyticsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAssetPerformance: builder.query<AnalyticsAssetPerformance[], void>({
      query: () => "/admin/analytics/asset-performance",
      providesTags: ["Asset"],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        return transformAssetPerformance(root);
      },
    }),
    getAnalyticsInit: builder.query<AnalyticsInitResponse, void>({
      query: () => "/admin/analytics/init",
      providesTags: ["Asset", "User"],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        return {
          kpis: transformKpis(root.kpis),
          userGrowth: transformUserGrowth(root.userGrowth),
          assetPerformance: transformAssetPerformance(root.assetPerformance),
        };
      },
    }),
    getAnalyticsKpis: builder.query<AnalyticsKpi[], void>({
      query: () => "/admin/analytics/kpis",
      providesTags: ["Asset", "User"],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        return transformKpis(root);
      },
    }),
    getUserGrowth: builder.query<UserGrowthPoint[], { months?: number } | void>({
      query: (params) => ({
        url: "/admin/analytics/user-growth",
        params: params || {},
      }),
      providesTags: ["User"],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        return transformUserGrowth(root);
      },
    }),
  }),
});

export const {
  useGetAssetPerformanceQuery,
  useGetAnalyticsInitQuery,
  useGetAnalyticsKpisQuery,
  useGetUserGrowthQuery,
} = analyticsApi;
