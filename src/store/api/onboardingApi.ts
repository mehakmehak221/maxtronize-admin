import { baseApi } from "./baseApi";

export interface OnboardingQueryParams {
  page?: any;
  limit?: any;
  status?: string;
  search?: string;
}

export interface OnboardingListItem {
  id: string;
  title: string;
  issuerName: string;
  type: string;
  status: string;
  targetAmount: string;
  progress: number;
  submittedAt: string;
}

export interface OnboardingDetail {
  id: string;
  title: string;
  description: string;
  issuerId: string;
  issuerName: string;
  type: string;
  status: string;
  targetAmount: string;
  raisedAmount: string;
  submittedAt: string;
  reviewedAt?: string;
  documents: {
    name: string;
    url: string;
    type: string;
  }[];
}

function extractArray(response: any): any[] {
  if (!response) return [];
  const root = response?.data ?? response;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.onboardings)) return root.onboardings;
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

function formatUSD(val: any, fallback = "N/A"): string {
  if (typeof val === "number") return `$${val.toLocaleString()}`;
  if (typeof val === "string" && val) return val;
  return fallback;
}

function mapOnboardingListItem(item: any): OnboardingListItem {
  const rawTarget = item.targetAmount ?? item.targetRaise ?? item.target ?? item.amount;
  return {
    id: safeStr(item.id || item.onboardingId, ""),
    title: safeStr(item.title || item.assetName || item.name, "Untitled"),
    issuerName: safeStr(
      item.issuerName || item.issuer?.name || item.companyName,
      typeof item.issuer === "string" ? item.issuer : "Unknown Issuer"
    ),
    type: safeStr(item.type || item.assetType || item.assetTypeLabel || item.category, "N/A"),
    status: safeStr(item.status || item.reviewStatus, "PENDING"),
    targetAmount: formatUSD(rawTarget),
    progress: typeof item.progress === "number" ? item.progress : 0,
    submittedAt: safeStr(item.submittedAt || item.createdAt, ""),
  };
}

function mapOnboardingDetail(raw: any): OnboardingDetail {
  const root = raw?.data ?? raw ?? {};
  const onb = root?.onboarding ?? root?.asset ?? root?.submission ?? root;

  const rawDocs = Array.isArray(onb.documents)
    ? onb.documents
    : Array.isArray(onb.files)
      ? onb.files
      : Array.isArray(onb.attachments)
        ? onb.attachments
        : [];

  const documents = rawDocs.map((doc: any) => ({
    name: safeStr(doc.name || doc.fileName || doc.title, "Document"),
    url: safeStr(doc.url || doc.fileUrl || doc.link, "#"),
    type: safeStr(doc.type || doc.fileType || doc.mimeType, "PDF"),
  }));

  return {
    id: safeStr(onb.id || onb.onboardingId, ""),
    title: safeStr(onb.title || onb.assetName || onb.name, "Untitled"),
    description: safeStr(onb.description || onb.summary || onb.overview, ""),
    issuerId: safeStr(onb.issuerId || onb.issuer?.id, ""),
    issuerName: safeStr(
      onb.issuerName || onb.issuer?.name || onb.companyName,
      typeof onb.issuer === "string" ? onb.issuer : "Unknown Issuer"
    ),
    type: safeStr(onb.type || onb.assetType || onb.category, "N/A"),
    status: safeStr(onb.status || onb.reviewStatus, "PENDING"),
    targetAmount: formatUSD(onb.targetAmount ?? onb.targetRaise ?? onb.target ?? onb.amount),
    raisedAmount: formatUSD(onb.raisedAmount ?? onb.raised ?? onb.capitalRaised, "$0"),
    submittedAt: safeStr(onb.submittedAt || onb.createdAt, ""),
    reviewedAt: onb.reviewedAt || onb.updatedAt || undefined,
    documents,
  };
}

export const onboardingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOnboardings: builder.query<OnboardingListItem[], OnboardingQueryParams | void>({
      query: (params) => ({
        url: "/admin/onboardings",
        params: params || {},
      }),
      transformResponse: (response: any) =>
        extractArray(response).map(mapOnboardingListItem),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Asset" as const, id })),
            { type: "Asset", id: "ONBOARDINGS_LIST" },
          ]
          : [{ type: "Asset", id: "ONBOARDINGS_LIST" }],
    }),
    getOnboardingById: builder.query<OnboardingDetail, string>({
      query: (id) => `/admin/onboardings/${id}`,
      providesTags: (result, error, id) => [{ type: "Asset", id }],
      transformResponse: (response: any) => mapOnboardingDetail(response),
    }),
    approveOnboarding: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/onboardings/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Asset", id },
        { type: "Asset", id: "ONBOARDINGS_LIST" },
      ],
    }),
    rejectOnboarding: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/onboardings/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "ONBOARDINGS_LIST" },
      ],
    }),
  }),
});

export const {
  useGetOnboardingsQuery,
  useGetOnboardingByIdQuery,
  useApproveOnboardingMutation,
  useRejectOnboardingMutation,
} = onboardingApi;
