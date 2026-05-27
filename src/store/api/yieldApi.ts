import { baseApi } from "./baseApi";

export interface Distribution {
  id: string;
  issuerId?: string;
  issuerName?: string;
  assetId?: string;
  assetName?: string;
  totalAmount: string;
  scheduledDate: string;
  status: "SCHEDULED" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "FAILED";
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface RejectDistributionRequest {
  reason: string;
}

function extractArray(response: any): any[] {
  if (!response) return [];
  const root = response?.data ?? response;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.distributions)) return root.distributions;
  if (Array.isArray(root.results)) return root.results;
  if (Array.isArray(root.list)) return root.list;
  const arrays = Object.values(root).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  return [];
}

function mapDistribution(item: any): Distribution {
  return {
    id: item.id || "",
    issuerId: item.issuerId || "",
    issuerName: item.issuerName || item.issuer?.name || "",
    assetId: item.assetId || "",
    assetName: item.assetName || item.asset?.name || "",
    totalAmount: typeof item.totalAmount === "number"
      ? `$${item.totalAmount.toLocaleString()}`
      : item.totalAmount || "$0",
    scheduledDate: item.scheduledDate
      ? new Date(item.scheduledDate).toLocaleDateString()
      : item.scheduledDate || "",
    status: item.status || "SCHEDULED",
    reason: item.reason || "",
    createdAt: item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : item.createdAt || "",
    updatedAt: item.updatedAt
      ? new Date(item.updatedAt).toLocaleString()
      : item.updatedAt || "",
    ...item,
  };
}

export const yieldApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET /admin/yield/pending-approvals - List all SCHEDULED distributions pending admin approval
    getPendingApprovals: builder.query<Distribution[], void>({
      query: () => ({
        url: "/admin/yield/pending-approvals",
      }),
      transformResponse: (response: any) =>
        extractArray(response).map(mapDistribution),
      providesTags: [{ type: "Yield", id: "PENDING_APPROVALS" }],
    }),

    // GET /admin/yield/approved-queue - List all approved distributions in the processing queue
    getApprovedQueue: builder.query<Distribution[], void>({
      query: () => ({
        url: "/admin/yield/approved-queue",
      }),
      transformResponse: (response: any) =>
        extractArray(response).map(mapDistribution),
      providesTags: [{ type: "Yield", id: "APPROVED_QUEUE" }],
    }),

    // POST /admin/yield/{id}/approve - Approve a scheduled distribution
    approveDistribution: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/yield/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Yield", id: "PENDING_APPROVALS" },
        { type: "Yield", id: "APPROVED_QUEUE" },
      ],
    }),

    // POST /admin/yield/{id}/reject - Reject a scheduled distribution
    rejectDistribution: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/yield/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: [
        { type: "Yield", id: "PENDING_APPROVALS" },
      ],
    }),

    // POST /admin/yield/trigger-payouts - Manually trigger the distribution cron job
    triggerPayouts: builder.mutation<void, void>({
      query: () => ({
        url: "/admin/yield/trigger-payouts",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Yield", id: "APPROVED_QUEUE" },
      ],
    }),
  }),
});

export const {
  useGetPendingApprovalsQuery,
  useGetApprovedQueueQuery,
  useApproveDistributionMutation,
  useRejectDistributionMutation,
  useTriggerPayoutsMutation,
} = yieldApi;
