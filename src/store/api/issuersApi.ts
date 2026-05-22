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

function normalizeIssuerInitResponse(response: any): IssuerInitResponse {
  const root = response?.data ?? response;
  const issuer = root?.issuer ?? root ?? {};

  return {
    issuer,
    assets: extractArray(root?.assets ?? issuer?.assets),
    financials: root?.financials ?? issuer?.financials ?? { revenue: [], health: [] },
    compliance: extractArray(root?.compliance ?? issuer?.compliance),
  };
}

export const issuersApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getIssuers: builder.query<IssuerListItem[], IssuersQueryParams | void>({
      query: (params) => ({
        url: "/admin/issuers",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        const list = extractArray(response);
        return list.map((item: any) => {
          const formatUSD = (val: any) => {
            if (val === null || val === undefined) return "$0.0M";
            if (typeof val === "string") return val.startsWith("$") ? val : `$${val}`;
            const num = Number(val);
            if (isNaN(num)) return "$0.0M";
            if (num >= 1_000_000) {
              return `$${(num / 1_000_000).toFixed(1)}M`;
            }
            if (num >= 1_000) {
              return `$${(num / 1_000).toFixed(1)}K`;
            }
            return `$${num.toLocaleString()}`;
          };

          // Robust raised amount extraction
          const raisedVal = item.totalRaised !== undefined ? item.totalRaised : (item.raised !== undefined ? item.raised : (item.raisedAmount !== undefined ? item.raisedAmount : 0));
          
          // Robust AUM extraction
          const aumVal = item.aum !== undefined ? item.aum : (item.totalAum !== undefined ? item.totalAum : 0);

          // Robust assets count formatting
          let assetsStr = "—";
          if (item.assets !== undefined && item.assets !== null) {
            if (Array.isArray(item.assets)) {
              const active = item.assets.filter((a: any) => a.status === "Active" || a.status === "Approved").length;
              const pending = item.assets.filter((a: any) => a.status === "Pending" || a.status === "Under Review" || a.status === "Under_Review").length;
              assetsStr = `${active} active • ${pending} pending`;
            } else if (typeof item.assets === "number") {
              assetsStr = `${item.assets} active`;
            } else {
              assetsStr = String(item.assets);
            }
          } else if (item.assetsCount !== undefined) {
            assetsStr = `${item.assetsCount} active`;
          } else if (item.totalAssets !== undefined) {
            assetsStr = `${item.totalAssets} active`;
          } else if (item.assetSummary) {
            const active = item.assetSummary.active || 0;
            const pending = item.assetSummary.submitted || item.assetSummary.pending || 0;
            assetsStr = `${active} active • ${pending} pending`;
          }

          // Robust status extraction
          const status = item.kybStatusLabel || item.kybStatus || item.status || "Pending";

          const name = item.name || item.companyName || item.businessName || item.legalName || "Unknown Issuer";
          const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

          return {
            id: item.id || item.issuerId || item.userId || "",
            name: name,
            initials: initials,
            email: item.email || item.contact?.email || "",
            country: item.country || item.location || item.jurisdiction || "—",
            assets: assetsStr,
            raised: formatUSD(raisedVal),
            aum: formatUSD(aumVal),
            status: status,
          };
        });
      },
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
      transformResponse: (response: any) => normalizeIssuerInitResponse(response),
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
