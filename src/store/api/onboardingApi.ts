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
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.assets)) return response.assets;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.list)) return response.list;
  
  const arrays = Object.values(response).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  
  return [];
}

export const onboardingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOnboardings: builder.query<OnboardingListItem[], OnboardingQueryParams | void>({
      query: (params) => ({
        url: "/admin/onboardings",
        params: params || {},
      }),
      transformResponse: (response: any) => extractArray(response),
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
