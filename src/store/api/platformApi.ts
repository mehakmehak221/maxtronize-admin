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
  const root = response?.data ?? response;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.results)) return root.results;
  if (Array.isArray(root.list)) return root.list;
  if (Array.isArray(root.activities)) return root.activities;
  const arrays = Object.values(root).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  return [];
}

export const platformApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPendingActions: builder.query<PendingActionsResponse, void>({
      query: () => "/admin/pending-actions",
      providesTags: ["Asset", "User"],
      transformResponse: (response: any): PendingActionsResponse => {
        const root = response?.data ?? response;
        return {
          pendingAssets: root?.pendingAssets ?? root?.assets ?? 0,
          pendingKyc: root?.pendingKyc ?? root?.kyc ?? 0,
          pendingKyb: root?.pendingKyb ?? root?.kyb ?? 0,
          pendingOnboardings: root?.pendingOnboardings ?? root?.onboardings ?? 0,
          total: root?.total ?? 0,
        };
      },
    }),
    getAdminRecentActivity: builder.query<PlatformRecentActivityItem[], { limit?: number } | void>({
      query: (params) => ({
        url: "/admin/recent-activity",
        params: params || {},
      }),
      transformResponse: (response: any): PlatformRecentActivityItem[] => {
        const root = response?.data ?? response;
        const arr = extractArray(root);
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
      transformResponse: (response: any): RevenueSummary => {
        const root = response?.data ?? response;
        return {
          totalRevenue: typeof root?.totalRevenue === "number"
            ? `$${root.totalRevenue.toLocaleString()}`
            : root?.totalRevenue || "$0",
          monthlyRevenue: typeof root?.monthlyRevenue === "number"
            ? `$${root.monthlyRevenue.toLocaleString()}`
            : root?.monthlyRevenue || "$0",
          revenueChange: root?.revenueChange || root?.changePercent !== undefined
            ? `${root.changePercent >= 0 ? "+" : ""}${root.changePercent}%`
            : "—",
          lastUpdated: root?.lastUpdated,
        };
      },
      providesTags: ["Transaction"],
    }),
    getMonthlyRevenue: builder.query<MonthlyRevenuePoint[], void>({
      query: () => "/admin/revenue-data/monthly",
      transformResponse: (response: any): MonthlyRevenuePoint[] => {
        const root = response?.data ?? response;
        const arr = extractArray(root?.series || root);
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
      transformResponse: (response: any): UserDataSummary => {
        const root = response?.data ?? response;
        return {
          totalInvestors: root?.totalInvestors ?? root?.investors?.total ?? 0,
          totalIssuers: root?.totalIssuers ?? root?.issuers?.total ?? 0,
          activeInvestors: root?.activeInvestors ?? root?.investors?.active ?? 0,
          activeIssuers: root?.activeIssuers ?? root?.issuers?.active ?? 0,
          newUsersThisMonth: root?.newUsersThisMonth ?? 0,
          kycPending: root?.kycPending ?? 0,
          kybPending: root?.kybPending ?? 0,
        };
      },
      providesTags: ["User"],
    }),
    getVerificationPipeline: builder.query<VerificationPipeline, void>({
      query: () => "/admin/verification",
      transformResponse: (response: any): VerificationPipeline => {
        const root = response?.data ?? response;
        return {
          kyc: {
            pending: root?.kyc?.pending ?? 0,
            underReview: root?.kyc?.underReview ?? 0,
            approved: root?.kyc?.approved ?? 0,
            rejected: root?.kyc?.rejected ?? 0,
          },
          kyb: {
            pending: root?.kyb?.pending ?? 0,
            underReview: root?.kyb?.underReview ?? 0,
            approved: root?.kyb?.approved ?? 0,
            rejected: root?.kyb?.rejected ?? 0,
          },
        };
      },
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
