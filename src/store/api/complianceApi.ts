import { baseApi } from "./baseApi";

export interface ComplianceIssueQueryParams {
  page?: any;
  limit?: any;
  status?: string;
  severity?: string;
  search?: string;
}

export interface ComplianceIssue {
  id: string;
  type: string;
  entity: string;
  entityType: string;
  description: string;
  severity: "High" | "Medium" | "Low";
  date: string;
  status: "Open" | "Under Review" | "Resolved";
}

export interface ComplianceSummaryStat {
  label: string;
  value: string;
  sub: string;
  color: string;
}

export interface ComplianceSummaryResponse {
  stats: ComplianceSummaryStat[];
  issuesCount: number;
}

export interface ComplianceInitResponse {
  stats: ComplianceSummaryStat[];
  issues: ComplianceIssue[];
}

function extractArray(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.issues)) return response.issues;
  if (Array.isArray(response.issues?.data)) return response.issues.data;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.list)) return response.list;
  
  const arrays = Object.values(response).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  
  return [];
}

function mapComplianceIssue(item: any): ComplianceIssue {
  return {
    id: item.id || item.issueCode || "",
    type: item.typeLabel || item.type || "Regulatory",
    entity: item.entityName || "Unknown",
    entityType: item.entityRole || "Investor",
    description: item.description || "",
    severity: item.severity || "Low",
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
    status: item.status || "Open",
  };
}

function transformComplianceStats(summary: any): ComplianceSummaryStat[] {
  const stats: ComplianceSummaryStat[] = [];
  if (!summary) return stats;

  if (summary.openIssues) {
    stats.push({
      label: "OPEN ISSUES",
      value: String(summary.openIssues.value),
      sub: summary.openIssues.label || "Low",
      color: "text-rose-500",
    });
  }
  if (summary.underReview) {
    stats.push({
      label: "UNDER REVIEW",
      value: String(summary.underReview.value),
      sub: summary.underReview.label || "Low",
      color: "text-amber-500",
    });
  }
  if (summary.resolvedToday) {
    stats.push({
      label: "RESOLVED TODAY",
      value: String(summary.resolvedToday.value),
      sub: summary.resolvedToday.label || "Low",
      color: "text-emerald-500",
    });
  }
  if (summary.complianceScore) {
    stats.push({
      label: "COMPLIANCE SCORE",
      value: `${summary.complianceScore.value}%`,
      sub: summary.complianceScore.label || "Fair",
      color: "text-blue-500",
    });
  }
  return stats;
}

export const complianceApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getComplianceInit: builder.query<ComplianceInitResponse, void>({
      query: () => "/admin/compliance/init",
      providesTags: ["Compliance"],
      transformResponse: (response: any) => ({
        stats: transformComplianceStats(response?.summary),
        issues: extractArray(response?.issues).map(mapComplianceIssue),
      }),
    }),
    getComplianceIssues: builder.query<ComplianceIssue[], ComplianceIssueQueryParams | void>({
      query: (params) => ({
        url: "/admin/compliance/issues",
        params: params || {},
      }),
      transformResponse: (response: any) =>
        extractArray(response).map(mapComplianceIssue),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Compliance" as const, id })),
              { type: "Compliance", id: "ISSUES_LIST" },
            ]
          : [{ type: "Compliance", id: "ISSUES_LIST" }],
    }),
    getComplianceIssueById: builder.query<ComplianceIssue, string>({
      query: (id) => `/admin/compliance/issues/${id}`,
      transformResponse: (response: any) => mapComplianceIssue(response),
      providesTags: (result, error, id) => [{ type: "Compliance", id }],
    }),
    resolveComplianceIssue: builder.mutation<void, { id: string; note: string }>({
      query: ({ id, note }) => ({
        url: `/admin/compliance/issues/${id}/resolve`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Compliance", id },
        { type: "Compliance", id: "ISSUES_LIST" },
      ],
    }),
    setComplianceIssueUnderReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/compliance/issues/${id}/under-review`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Compliance", id },
        { type: "Compliance", id: "ISSUES_LIST" },
      ],
    }),
    getComplianceSummary: builder.query<ComplianceSummaryResponse, void>({
      query: () => "/admin/compliance/summary",
      providesTags: ["Compliance"],
      transformResponse: (response: any) => ({
        stats: transformComplianceStats(response),
        issuesCount: response?.openIssues?.value || 0,
      }),
    }),
  }),
});

export const {
  useGetComplianceInitQuery,
  useGetComplianceIssuesQuery,
  useGetComplianceIssueByIdQuery,
  useResolveComplianceIssueMutation,
  useSetComplianceIssueUnderReviewMutation,
  useGetComplianceSummaryQuery,
} = complianceApi;
