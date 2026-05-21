import { baseApi } from "./baseApi";

export interface IssuersQueryParams {
  page?: any;
  limit?: any;
  kybStatus?: string;
  search?: string;
}

export interface IssuerListItem {
  id: string;
  name: string;
  initials: string;
  email: string;
  country: string;
  assets: string;
  raised: string;
  aum: string;
  status: string;
  color?: string;
}

export interface IssuerStats {
  totalRaised: string;
  aum: string;
  totalInvestors: number;
  avgYield: string;
}

export interface IssuerAssetSummary {
  active: number;
  submitted: number;
  approved: number;
  rejected: number;
}

export interface IssuerPersonnel {
  name: string;
  role: string;
  verified: boolean;
}

export interface IssuerAsset {
  id: string;
  name: string;
  type: string;
  amount: string;
  date: string;
  status: string;
}

export interface RevenueBreakdown {
  label: string;
  value: string;
  percent: number;
}

export interface HealthMetric {
  label: string;
  value: string;
  status: string;
  statusColor?: string;
}

export interface IssuerFinancials {
  revenue: RevenueBreakdown[];
  health: HealthMetric[];
}

export interface IssuerComplianceItem {
  label: string;
  desc: string;
  status: string;
  date: string;
}

export interface IssuerGrowthPoint {
  month: string;
  value: number;
}

export interface IssuerDetail {
  id: string;
  name: string;
  location: string;
  regNumber: string;
  status: string;
  joined: string;
  bio: string;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  stats: IssuerStats;
  assetSummary: IssuerAssetSummary;
  personnel: IssuerPersonnel[];
  assets: IssuerAsset[];
  financials: IssuerFinancials;
  growthData: IssuerGrowthPoint[];
}

export interface IssuerInitResponse {
  issuer: IssuerDetail;
  assets: IssuerAsset[];
  financials: IssuerFinancials;
  compliance: IssuerComplianceItem[];
}

export interface IssuerOverviewResponse {
  id: string;
  name: string;
  location: string;
  regNumber: string;
  status: string;
  totalRaised: string;
  aum: string;
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

export const issuersApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getIssuers: builder.query<IssuerListItem[], IssuersQueryParams | void>({
      query: (params) => ({
        url: "/admin/issuers",
        params: params || {},
      }),
      transformResponse: (response: any) => extractArray(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Issuer" as const, id })),
              { type: "Issuer", id: "ISSUERS_LIST" },
            ]
          : [{ type: "Issuer", id: "ISSUERS_LIST" }],
    }),
    getIssuerById: builder.query<IssuerDetail, string>({
      query: (id) => `/admin/issuers/${id}`,
      providesTags: (result, error, id) => [{ type: "Issuer", id }],
    }),
    getIssuerAssets: builder.query<IssuerAsset[], string>({
      query: (id) => `/admin/issuers/${id}/assets`,
      transformResponse: (response: any) => extractArray(response),
      providesTags: (result, error, id) => [{ type: "Issuer", id: `${id}_assets` }],
    }),
    getIssuerCompliance: builder.query<IssuerComplianceItem[], string>({
      query: (id) => `/admin/issuers/${id}/compliance`,
      transformResponse: (response: any) => extractArray(response),
      providesTags: (result, error, id) => [{ type: "Issuer", id: `${id}_compliance` }],
    }),
    getIssuerFinancials: builder.query<IssuerFinancials, string>({
      query: (id) => `/admin/issuers/${id}/financials`,
      providesTags: (result, error, id) => [{ type: "Issuer", id: `${id}_financials` }],
    }),
    getIssuerInit: builder.query<IssuerInitResponse, string>({
      query: (id) => `/admin/issuers/${id}/init`,
      providesTags: (result, error, id) => [
        { type: "Issuer", id },
        { type: "Issuer", id: `${id}_init` },
      ],
    }),
    getIssuerOverview: builder.query<IssuerOverviewResponse, string>({
      query: (id) => `/admin/issuers/${id}/overview`,
      providesTags: (result, error, id) => [{ type: "Issuer", id: `${id}_overview` }],
    }),
    activateIssuer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/issuers/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Issuer", id },
        { type: "Issuer", id: "ISSUERS_LIST" },
        { type: "Issuer", id: `${id}_init` },
        { type: "Issuer", id: `${id}_overview` },
      ],
    }),
    suspendIssuer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/issuers/${id}/suspend`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Issuer", id },
        { type: "Issuer", id: "ISSUERS_LIST" },
        { type: "Issuer", id: `${id}_init` },
        { type: "Issuer", id: `${id}_overview` },
      ],
    }),
    approveIssuerKyb: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/issuers/${id}/kyb/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Issuer", id },
        { type: "Issuer", id: "ISSUERS_LIST" },
        { type: "Issuer", id: `${id}_init` },
        { type: "Issuer", id: `${id}_compliance` },
        { type: "Issuer", id: `${id}_overview` },
      ],
    }),
    rejectIssuerKyb: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/issuers/${id}/kyb/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Issuer", id },
        { type: "Issuer", id: "ISSUERS_LIST" },
        { type: "Issuer", id: `${id}_init` },
        { type: "Issuer", id: `${id}_compliance` },
        { type: "Issuer", id: `${id}_overview` },
      ],
    }),
    setIssuerKybUnderReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/issuers/${id}/kyb/under-review`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Issuer", id },
        { type: "Issuer", id: "ISSUERS_LIST" },
        { type: "Issuer", id: `${id}_init` },
        { type: "Issuer", id: `${id}_compliance` },
        { type: "Issuer", id: `${id}_overview` },
      ],
    }),
  }),
});

export const {
  useGetIssuersQuery,
  useGetIssuerByIdQuery,
  useGetIssuerAssetsQuery,
  useGetIssuerComplianceQuery,
  useGetIssuerFinancialsQuery,
  useGetIssuerInitQuery,
  useGetIssuerOverviewQuery,
  useActivateIssuerMutation,
  useSuspendIssuerMutation,
  useApproveIssuerKybMutation,
  useRejectIssuerKybMutation,
  useSetIssuerKybUnderReviewMutation,
} = issuersApi;
