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
  assetCode?: string;
  assetName?: string;
  issuerName?: string;
  assetTypeLabel?: string;
  assetType?: string;
  reviewStatus?: string;
  submittedAt?: string;
}

export interface AssetDetail {
  id: string;
  name?: string;
  issuer?: string;
  type?: string;
  valuation?: string;
  tokens?: string;
  price?: string;
  compliance?: string;
  risk?: string;
  jurisdiction?: string;
  status?: string;
  date?: string;
  assetCode?: string;
  title?: string;
  assetName?: string;
  issuerName?: string;
  assetTypeLabel?: string;
  assetType?: string;
  reviewStatus?: string;
  totalValuation?: number;
  targetRaise?: number;
  projectedApy?: number | null;
}

export interface AssetComplianceCheck {
  id?: string;
  key?: string;
  type?: string;
  title?: string;
  description?: string;
  status?: string;
}

export interface AssetComplianceTab {
  id?: string;
  complianceScore?: number;
  status?: string;
  details?: string;
  issues?: AssetComplianceCheck[];
  checks?: AssetComplianceCheck[];
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
  valuation?: string;
  targetRaise?: string;
  minimumInvestment?: string;
  annualReturn?: string;
  distributionFrequency?: string;
  performanceGraphData?: Array<{ name: string; value: number }>;
  summary?: {
    valuation?: { value?: number };
    totalRevenue?: { value?: number };
    netIncome?: { value?: number };
    operatingExpenses?: { value?: number };
  };
  capitalRaisedRecent?: number;
  currency?: string;
}

export type AssetDocumentsResponse =
  | AssetDocument[]
  | { data?: AssetDocument[]; documents?: AssetDocument[] };

export interface AssetInitResponse {
  asset: AssetDetail;
  overview: any;
  compliance: AssetComplianceTab;
  documents: AssetDocument[];
  financials: AssetFinancialsTab;
}

function extractArray(response: any): any[] {
  if (!response) return [];
  const root = response?.data ?? response;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.assets)) return root.assets;
  if (Array.isArray(root.results)) return root.results;
  if (Array.isArray(root.list)) return root.list;

  const arrays = Object.values(root).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];

  return [];
}

function safeStr(val: any, fallback = ""): string {
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (val && typeof val === "object" && typeof val.name === "string") return val.name;
  return fallback;
}

function mapAssetDocument(item: any): any {
  const rawDate = item.uploadedAt || item.createdAt || item.date || item.submittedAt;
  const dateStr = rawDate ? (typeof rawDate === "string" ? rawDate : new Date(rawDate).toLocaleDateString()) : "N/A";
  
  const baseUrl = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) 
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "") 
    : "https://maxtronize-api.maxtron.ai";
    
  return {
    id: safeStr(item.id || item.docId, Math.random().toString()),
    name: safeStr(item.name || item.title || item.fileName, "Untitled Document"),
    type: safeStr(item.type || item.docType || item.fileType || item.category, "Document"),
    status: safeStr(item.status || item.verificationStatus || item.reviewStatus, "Pending"),
    url: item.downloadKey ? `${baseUrl}/${item.downloadKey}` : safeStr(item.url || item.link, "#"),
    uploadedAt: dateStr === "Invalid Date" ? "N/A" : dateStr,
  };
}

export const assetsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPendingAssets: builder.query<AssetListItem[], AssetPendingQueryParams | void>({
      query: (params) => ({
        url: "/admin/assets/pending",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        const list = extractArray(response);
        return list.map((item: any) => ({
          ...item,

          issuer: item.issuer?.name || item.issuerName || (typeof item.issuer === "string" ? item.issuer : "") || "",
          issuerName: item.issuerName || item.issuer?.name || (typeof item.issuer === "string" ? item.issuer : "") || "",
          name: item.assetName || item.name || item.title || "",
          assetName: item.assetName || item.name || item.title || "",
          amount: typeof item.amount === "number"
            ? `$${item.amount.toLocaleString()}`
            : typeof item.amount === "string"
              ? item.amount
              : typeof item.totalValuation === "number"
                ? `$${item.totalValuation.toLocaleString()}`
                : item.amount || "",
          status: item.reviewStatus || item.status || "Pending",
          type: item.assetTypeLabel || item.assetType || item.type || "",
          date: item.submittedAt
            ? new Date(item.submittedAt).toLocaleDateString()
            : item.date || "",
        }));
      },
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
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getAssetInit: builder.query<AssetInitResponse, string>({
      query: (id) => `/admin/assets/${id}/init`,
      providesTags: (result, error, id) => [
        { type: "Asset", id },
        { type: "Asset", id: `${id}_init` },
      ],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getAssetOverview: builder.query<any, string>({
      query: (id) => `/admin/assets/${id}/overview`,
      providesTags: (result, error, id) => [{ type: "Asset", id: `${id}_overview` }],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getAssetCompliance: builder.query<AssetComplianceTab, string>({
      query: (id) => `/admin/assets/${id}/compliance`,
      providesTags: (result, error, id) => [{ type: "Asset", id: `${id}_compliance` }],
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getAssetDocuments: builder.query<AssetDocumentsResponse, string>({
      query: (id) => `/admin/assets/${id}/documents`,
      transformResponse: (response: any) => extractArray(response).map(mapAssetDocument),
      providesTags: (result, error, id) => [{ type: "Asset", id: `${id}_documents` }],
    }),
    getAssetFinancials: builder.query<AssetFinancialsTab, string>({
      query: (id) => `/admin/assets/${id}/financials`,
      providesTags: (result, error, id) => [{ type: "Asset", id: `${id}_financials` }],
      transformResponse: (response: any) => response?.data ?? response,
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
