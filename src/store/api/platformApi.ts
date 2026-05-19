import { baseApi } from "./baseApi";

export interface PendingActionsResponse {
  pendingAssets: number;
  pendingKyc: number;
  pendingKyb: number;
  pendingOnboardings: number;
  total: number;
}

export interface PlatformRecentActivityItem {
  id: string;
  action: string;
  entity: string;
  entityType: string;
  performedBy: string;
  date: string;
  status?: string;
}

export interface RevenueSummary {
  totalRevenue: string;
  monthlyRevenue: string;
  revenueChange: string;
  lastUpdated?: string;
}

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
  payouts?: number;
}

export interface UserDataSummary {
  totalInvestors: number;
  totalIssuers: number;
  activeInvestors: number;
  activeIssuers: number;
  newUsersThisMonth: number;
  kycPending: number;
  kybPending: number;
}

export interface VerificationPipeline {
  kyc: {
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
  kyb: {
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
}

function extractArray(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.list)) return response.list;
  if (Array.isArray(response.activities)) return response.activities;
  const arrays = Object.values(response).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  return [];
}

export const platformApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPendingActions: builder.query<PendingActionsResponse, void>({
      query: () => "/admin/pending-actions",
      providesTags: ["Asset", "User"],
      transformResponse: (response: any): PendingActionsResponse => ({
        pendingAssets: response?.pendingAssets ?? response?.assets ?? 0,
        pendingKyc: response?.pendingKyc ?? response?.kyc ?? 0,
        pendingKyb: response?.pendingKyb ?? response?.kyb ?? 0,
        pendingOnboardings: response?.pendingOnboardings ?? response?.onboardings ?? 0,
        total: response?.total ?? 0,
      }),
    }),
    getAdminRecentActivity: builder.query<PlatformRecentActivityItem[], { limit?: number } | void>({
      query: (params) => ({
        url: "/admin/recent-activity",
        params: params || {},
      }),
      transformResponse: (response: any): PlatformRecentActivityItem[] => {
        const arr = extractArray(response);
        return arr.map((item: any) => ({
          id: item.id || "",
          action: item.action || item.type || item.eventType || "",
          entity: item.entity || item.entityName || item.name || "",
          entityType: item.entityType || item.entityRole || "",
          performedBy: item.performedBy || item.adminName || item.actor || "Admin",
          date: item.createdAt ? new Date(item.createdAt).toLocaleString() : item.date || "",
          status: item.status,
        }));
      },
      providesTags: ["Transaction"],
    }),
    getRevenueData: builder.query<RevenueSummary, void>({
      query: () => "/admin/revenue-data",
      transformResponse: (response: any): RevenueSummary => ({
        totalRevenue: typeof response?.totalRevenue === "number"
          ? `$${response.totalRevenue.toLocaleString()}`
          : response?.totalRevenue || "$0",
        monthlyRevenue: typeof response?.monthlyRevenue === "number"
          ? `$${response.monthlyRevenue.toLocaleString()}`
          : response?.monthlyRevenue || "$0",
        revenueChange: response?.revenueChange || response?.changePercent
          ? `${response.changePercent >= 0 ? "+" : ""}${response.changePercent}%`
          : "—",
        lastUpdated: response?.lastUpdated,
      }),
      providesTags: ["Transaction"],
    }),
    getMonthlyRevenue: builder.query<MonthlyRevenuePoint[], void>({
      query: () => "/admin/revenue-data/monthly",
      transformResponse: (response: any): MonthlyRevenuePoint[] => {
        const arr = extractArray(response?.series || response);
        return arr.map((item: any) => ({
          month: item.month || item.name || "",
          revenue: item.revenue || item.value || 0,
          payouts: item.payouts || 0,
        }));
      },
      providesTags: ["Transaction"],
    }),
    getUserDataSummary: builder.query<UserDataSummary, void>({
      query: () => "/admin/user-data",
      transformResponse: (response: any): UserDataSummary => ({
        totalInvestors: response?.totalInvestors ?? response?.investors?.total ?? 0,
        totalIssuers: response?.totalIssuers ?? response?.issuers?.total ?? 0,
        activeInvestors: response?.activeInvestors ?? response?.investors?.active ?? 0,
        activeIssuers: response?.activeIssuers ?? response?.issuers?.active ?? 0,
        newUsersThisMonth: response?.newUsersThisMonth ?? 0,
        kycPending: response?.kycPending ?? 0,
        kybPending: response?.kybPending ?? 0,
      }),
      providesTags: ["User"],
    }),
    getVerificationPipeline: builder.query<VerificationPipeline, void>({
      query: () => "/admin/verification",
      transformResponse: (response: any): VerificationPipeline => ({
        kyc: {
          pending: response?.kyc?.pending ?? 0,
          underReview: response?.kyc?.underReview ?? 0,
          approved: response?.kyc?.approved ?? 0,
          rejected: response?.kyc?.rejected ?? 0,
        },
        kyb: {
          pending: response?.kyb?.pending ?? 0,
          underReview: response?.kyb?.underReview ?? 0,
          approved: response?.kyb?.approved ?? 0,
          rejected: response?.kyb?.rejected ?? 0,
        },
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetPendingActionsQuery,
  useGetAdminRecentActivityQuery,
  useGetRevenueDataQuery,
  useGetMonthlyRevenueQuery,
  useGetUserDataSummaryQuery,
  useGetVerificationPipelineQuery,
} = platformApi;
