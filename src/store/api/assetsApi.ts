import { baseApi } from "./baseApi";

export interface AssetPendingQueryParams {
  page?: any;
  limit?: any;
  status?: string;
  search?: string;
}

export interface AssetListItem {
  id: string;
  name: string;
  issuer: string;
  type: string;
  amount: string;
  date: string;
  status: string;
}

export interface AssetDetail {
  id: string;
  name: string;
  issuer: string;
  type: string;
  valuation: string;
  tokens: string;
  price: string;
  compliance: string;
  risk: string;
  jurisdiction: string;
  status: string;
  date?: string;
}

export interface AssetComplianceTab {
  id: string;
  complianceScore: number;
  status: string;
  details: string;
  issues: Array<{
    id: string;
    type: string;
    description: string;
    status: string;
  }>;
}

export interface AssetDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  status: string;
}

export interface AssetFinancialsTab {
  valuation: string;
  targetRaise: string;
  minimumInvestment: string;
  annualReturn: string;
  distributionFrequency: string;
  performanceGraphData?: Array<{ name: string; value: number }>;
}

export interface AssetInitResponse {
  asset: AssetDetail;
  overview: any;
  compliance: AssetComplianceTab;
  documents: AssetDocument[];
  financials: AssetFinancialsTab;
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

export const assetsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPendingAssets: builder.query<AssetListItem[], AssetPendingQueryParams | void>({
      query: (params) => ({
        url: "/admin/assets/pending",
        params: params || {},
      }),
      transformResponse: (response: any) => extractArray(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Asset" as const, id })),
              { type: "Asset", id: "PENDING_LIST" },
            ]
          : [{ type: "Asset", id: "PENDING_LIST" }],
    }),
    getAssetById: builder.query<AssetDetail, string>({
      query: (id) => `/admin/assets/${id}`,
      providesTags: (result, error, id) => [{ type: "Asset", id }],
    }),
    getAssetInit: builder.query<AssetInitResponse, string>({
      query: (id) => `/admin/assets/${id}/init`,
      providesTags: (result, error, id) => [
        { type: "Asset", id },
        { type: "Asset", id: `${id}_init` },
      ],
    }),
    getAssetOverview: builder.query<any, string>({
      query: (id) => `/admin/assets/${id}/overview`,
      providesTags: (result, error, id) => [{ type: "Asset", id: `${id}_overview` }],
    }),
    getAssetCompliance: builder.query<AssetComplianceTab, string>({
      query: (id) => `/admin/assets/${id}/compliance`,
      providesTags: (result, error, id) => [{ type: "Asset", id: `${id}_compliance` }],
    }),
    getAssetDocuments: builder.query<AssetDocument[], string>({
      query: (id) => `/admin/assets/${id}/documents`,
      transformResponse: (response: any) => extractArray(response),
      providesTags: (result, error, id) => [{ type: "Asset", id: `${id}_documents` }],
    }),
    getAssetFinancials: builder.query<AssetFinancialsTab, string>({
      query: (id) => `/admin/assets/${id}/financials`,
      providesTags: (result, error, id) => [{ type: "Asset", id: `${id}_financials` }],
    }),
    approveAsset: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/assets/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Asset", id },
        { type: "Asset", id: "PENDING_LIST" },
        { type: "Asset", id: `${id}_init` },
      ],
    }),
    rejectAsset: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/assets/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "PENDING_LIST" },
        { type: "Asset", id: `${id}_init` },
      ],
    }),
  }),
});

export const {
  useGetPendingAssetsQuery,
  useGetAssetByIdQuery,
  useGetAssetInitQuery,
  useGetAssetOverviewQuery,
  useGetAssetComplianceQuery,
  useGetAssetDocumentsQuery,
  useGetAssetFinancialsQuery,
  useApproveAssetMutation,
  useRejectAssetMutation,
} = assetsApi;
