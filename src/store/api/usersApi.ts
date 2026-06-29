import { baseApi } from "./baseApi";

// Unified user type that works for both investors and issuers
export interface UnifiedUserListItem {
  id: string;
  name: string;
  email: string;
  role: "INVESTOR" | "ISSUER" | string;
  country: string;
  status: string;
  kycStatus?: string;
  kybStatus?: string;
  joined: string;
}

export interface UnifiedUserDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "INVESTOR" | "ISSUER" | string;
  country: string;
  status: string;
  joined: string;
  kycStatus?: string;
  kybStatus?: string;
  // investor-specific
  portfolioValue?: string;
  totalInvested?: string;
  // issuer-specific
  totalRaised?: string;
  aum?: string;
  // raw backend payload pass-through
  [key: string]: any;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

function extractArray(response: any): any[] {
  if (!response) return [];
  const root = response?.data ?? response;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.users)) return root.users;
  if (Array.isArray(root.results)) return root.results;
  if (Array.isArray(root.list)) return root.list;
  
  const arrays = Object.values(root).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  
  return [];
}

/** Returns a formatted date string, or "" if the value is missing/invalid. */
function safeDate(value: any, opts?: { time?: boolean }): string {
  if (!value || typeof value !== "string" && typeof value !== "number") return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return opts?.time ? d.toLocaleString() : d.toLocaleDateString();
}

function mapUser(item: any): UnifiedUserListItem {
  return {
    id: item.id || item.userId || "",
    name: item.name || item.fullName || "",
    email: item.email || "",
    role: item.role || item.userType || item.type || "INVESTOR",
    country: item.location || item.country || "",
    status: item.status || "Active",
    kycStatus: item.kycStatusLabel || item.kycStatus,
    kybStatus: item.kybStatusLabel || item.kybStatus,
    joined: safeDate(item.createdAt) || safeDate(item.joinedAt) || item.joined || "",
  };
}

export const usersApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET /admin/users — all investors + issuers combined
    getAllUsers: builder.query<UnifiedUserListItem[], UsersQueryParams | void>({
      query: (params) => ({
        url: "/admin/users",
        params: params || {},
      }),
      transformResponse: (response: any) =>
        extractArray(response).map(mapUser),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "ALL_USERS_LIST" },
            ]
          : [{ type: "User", id: "ALL_USERS_LIST" }],
    }),

    // GET /admin/users/{id} — unified user detail (plural)
    getUserById: builder.query<UnifiedUserDetail, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id: `user_${id}` }],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        return {
          ...root,
          id: root.id || root.userId || "",
          name: root.name || root.fullName || "",
          email: root.email || "",
          role: root.role || root.userType || root.type || "INVESTOR",
          country: root.location || root.country || "",
          status: root.status || "Active",
          kycStatus: root.kycStatusLabel || root.kycStatus,
          kybStatus: root.kybStatusLabel || root.kybStatus,
          joined: safeDate(root.createdAt) || safeDate(root.joinedAt) || root.joined || "",
        };
      }
    }),

    // GET /admin/user/{id} — singular variant (same endpoint, different path)
    getUserByIdSingular: builder.query<UnifiedUserDetail, string>({
      query: (id) => `/admin/user/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id: `user_singular_${id}` }],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        return {
          ...root,
          id: root.id || root.userId || "",
          name: root.name || root.fullName || "",
          email: root.email || "",
          role: root.role || root.userType || root.type || "INVESTOR",
          country: root.location || root.country || "",
          status: root.status || "Active",
          kycStatus: root.kycStatusLabel || root.kycStatus,
          kybStatus: root.kybStatusLabel || root.kybStatus,
          joined: safeDate(root.createdAt) || safeDate(root.joinedAt) || root.joined || "",
        };
      }
    }),

    // PATCH /admin/users/{id}/activate
    activateUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id: `user_${id}` },
        { type: "User", id: "ALL_USERS_LIST" },
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
        { type: "Issuer", id },
        { type: "Issuer", id: "ISSUERS_LIST" },
      ],
    }),

    // PATCH /admin/users/{id}/suspend
    suspendUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/suspend`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id: `user_${id}` },
        { type: "User", id: "ALL_USERS_LIST" },
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
        { type: "Issuer", id },
        { type: "Issuer", id: "ISSUERS_LIST" },
      ],
    }),

    // POST /admin/users/{id}/kyc/approve — investor KYC via users endpoint
    approveUserKyc: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/kyc/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id: `user_${id}` },
        { type: "User", id: "ALL_USERS_LIST" },
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
      ],
    }),

    // POST /admin/users/{id}/kyc/reject
    rejectUserKyc: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/users/${id}/kyc/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `user_${id}` },
        { type: "User", id: "ALL_USERS_LIST" },
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
      ],
    }),

    // POST /admin/users/{id}/kyb/approve — issuer KYB via users endpoint
    approveUserKyb: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/kyb/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id: `user_${id}` },
        { type: "User", id: "ALL_USERS_LIST" },
        { type: "Issuer", id },
        { type: "Issuer", id: "ISSUERS_LIST" },
      ],
    }),

    // POST /admin/users/{id}/kyb/reject
    rejectUserKyb: builder.mutation<void, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/users/${id}/kyb/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `user_${id}` },
        { type: "User", id: "ALL_USERS_LIST" },
        { type: "Issuer", id },
        { type: "Issuer", id: "ISSUERS_LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserByIdSingularQuery,
  useActivateUserMutation,
  useSuspendUserMutation,
  useApproveUserKycMutation,
  useRejectUserKycMutation,
  useApproveUserKybMutation,
  useRejectUserKybMutation,
} = usersApi;
