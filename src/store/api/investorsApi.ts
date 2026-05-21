import { baseApi } from "./baseApi";

export interface InvestorsQueryParams {
  page?: any;
  limit?: any;
  kycStatus?: string;
  search?: string;
}

export interface InvestorListItem {
  id: string;
  name: string;
  email: string;
  country: string;
  kycStatus: string;
  portfolioValue: string;
  invested: string;
  joined: string;
  initials: string;
  color?: string;
}

export interface InvestorStats {
  portfolioValue: string;
  totalInvested: string;
  currentReturn: string;
  activeInvestments: number;
  avgYield: string;
  distributions: string;
  unrealizedGains: string;
}

export interface InvestorAllocation {
  name: string;
  value: number;
  color?: string;
}

export interface InvestorInvestment {
  name: string;
  id: string;
  tokens: number;
  invested: string;
  value: string;
  return: string;
  gain: string;
  status: string;
}

export interface InvestorTransaction {
  type: string;
  asset: string;
  amount: string;
  date: string;
  status: string;
}

export interface InvestorComplianceItem {
  label: string;
  status: string;
  date: string;
  desc: string;
}

export interface InvestorPerformancePoint {
  name: string;
  value: number;
}

export interface InvestorDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  joined: string;
  wallet: string;
  tier: string;
  status: string;
  bio: string;
  stats: InvestorStats;
  portfolioAllocation: InvestorAllocation[];
  investments: InvestorInvestment[];
  transactions: InvestorTransaction[];
  compliance: InvestorComplianceItem[];
  performanceData: InvestorPerformancePoint[];
}

export interface InvestorInitResponse {
  investor: InvestorDetail;
  compliance: InvestorComplianceItem[];
  investments: InvestorInvestment[];
}

export interface InvestorOverviewResponse {
  name: string;
  email: string;
  country: string;
  joined: string;
  kycStatus: string;
  activeInvestments: number;
  portfolioValue: string;
}

function extractArray(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.assets)) return response.assets;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.list)) return response.list;
  
  const arrays = Object.values(response).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  
  return [];
}

export const investorsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInvestors: builder.query<InvestorListItem[], InvestorsQueryParams | void>({
      query: (params) => ({
        url: "/admin/investors",
        params: params || {},
      }),
      transformResponse: (response: any) => extractArray(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "INVESTORS_LIST" },
            ]
          : [{ type: "User", id: "INVESTORS_LIST" }],
    }),
    getInvestorById: builder.query<InvestorDetail, string>({
      query: (id) => `/admin/investors/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getInvestorCompliance: builder.query<InvestorComplianceItem[], string>({
      query: (id) => `/admin/investors/${id}/compliance`,
      transformResponse: (response: any) => extractArray(response),
      providesTags: (result, error, id) => [{ type: "User", id: `${id}_compliance` }],
    }),
    getInvestorInit: builder.query<InvestorInitResponse, string>({
      query: (id) => `/admin/investors/${id}/init`,
      providesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: `${id}_init` },
      ],
    }),
    getInvestorInvestments: builder.query<InvestorInvestment[], string>({
      query: (id) => `/admin/investors/${id}/investments`,
      transformResponse: (response: any) => extractArray(response),
      providesTags: (result, error, id) => [{ type: "User", id: `${id}_investments` }],
    }),
    getInvestorOverview: builder.query<InvestorOverviewResponse, string>({
      query: (id) => `/admin/investors/${id}/overview`,
      providesTags: (result, error, id) => [{ type: "User", id: `${id}_overview` }],
    }),
    activateInvestor: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/investors/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
        { type: "User", id: `${id}_init` },
        { type: "User", id: `${id}_overview` },
      ],
    }),
    suspendInvestor: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/investors/${id}/suspend`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
        { type: "User", id: `${id}_init` },
        { type: "User", id: `${id}_overview` },
      ],
    }),
    approveInvestorKyc: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/investors/${id}/kyc/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
        { type: "User", id: `${id}_init` },
        { type: "User", id: `${id}_compliance` },
        { type: "User", id: `${id}_overview` },
      ],
    }),
    rejectInvestorKyc: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/investors/${id}/kyc/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
        { type: "User", id: `${id}_init` },
        { type: "User", id: `${id}_compliance` },
        { type: "User", id: `${id}_overview` },
      ],
    }),
    setInvestorKycUnderReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/investors/${id}/kyc/under-review`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
        { type: "User", id: `${id}_init` },
        { type: "User", id: `${id}_compliance` },
        { type: "User", id: `${id}_overview` },
      ],
    }),
    getInvestorTransactions: builder.query<InvestorTransaction[], string>({
      query: (id) => `/admin/investors/${id}/transactions`,
      transformResponse: (response: any) => extractArray(response),
      providesTags: (result, error, id) => [{ type: "User", id: `${id}_transactions` }],
    }),
  }),
});

export const {
  useGetInvestorsQuery,
  useGetInvestorByIdQuery,
  useGetInvestorComplianceQuery,
  useGetInvestorInitQuery,
  useGetInvestorInvestmentsQuery,
  useGetInvestorOverviewQuery,
  useActivateInvestorMutation,
  useSuspendInvestorMutation,
  useApproveInvestorKycMutation,
  useRejectInvestorKycMutation,
  useSetInvestorKycUnderReviewMutation,
  useGetInvestorTransactionsQuery,
} = investorsApi;
