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
  key?: string;
  canApprove?: boolean;
  rawStatus?: string;
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
  isAccredited?: boolean;
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

function robustUnwrap(response: any): any {
  if (!response) return {};
  let current = response;
  while (current && typeof current === "object") {
    if ("success" in current && "data" in current) {
      current = current.data;
    } else if ("data" in current && Object.keys(current).length === 1) {
      current = current.data;
    } else {
      break;
    }
  }
  return current;
}

function extractArray(response: any): any[] {
  if (!response) return [];
  const root = robustUnwrap(response);
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.assets)) return root.assets;
  if (Array.isArray(root.results)) return root.results;
  if (Array.isArray(root.list)) return root.list;
  if (Array.isArray(root.users)) return root.users;
  if (Array.isArray(root.issues)) return root.issues;
  if (Array.isArray(root.transactions)) return root.transactions;
  if (Array.isArray(root.activities)) return root.activities;
  if (Array.isArray(root.checks)) return root.checks;

  const arrays = Object.values(root).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];

  return [];
}

function mapInvestorDetail(response: any, id: string): InvestorDetail {
  const root = robustUnwrap(response);
  const header = root?.header || root?.investor || {};
  const overview = root?.overview || root || {};
  const statsSource = header.summary || overview.stats || {};
  const statistics = overview.statistics || {};

  const formatUSD = (val: any) => {
    if (val === null || val === undefined) return "$0";
    if (typeof val === "string") return val.startsWith("$") ? val : `$${val}`;
    return `$${Number(val).toLocaleString()}`;
  };

  const formatPercent = (val: any) => {
    if (val === null || val === undefined) return "+0%";
    const num = Number(val);
    return `${num >= 0 ? "+" : ""}${num}%`;
  };

  return {
    id: header.id || id,
    name: header.name || "Unknown Investor",
    email: header.email || "",
    phone: header.phone || "",
    country: header.country || header.location || "Unknown",
    joined: header.joinedAt ? new Date(header.joinedAt).toLocaleDateString() : (header.joined || "N/A"),
    wallet: header.walletAddress || header.wallet || "N/A",
    tier: header.tier || "Standard",
    status: header.kycStatusLabel || header.kycStatus || header.status || "Pending",
    bio: overview.bio || "No biography available.",
    isAccredited: header.isAccredited ?? overview.isAccredited ?? false,
    stats: {
      portfolioValue: formatUSD(statsSource.portfolioValue || 0),
      totalInvested: formatUSD(statsSource.totalInvested || 0),
      currentReturn: formatPercent(statsSource.currentReturnPercent || statsSource.currentReturn || 0),
      activeInvestments: statsSource.activeInvestments || 0,
      avgYield: formatPercent(statistics.avgYield || statsSource.avgYield || 0),
      distributions: formatUSD(statistics.distributions || statsSource.distributions || 0),
      unrealizedGains: formatUSD(statistics.unrealizedGains || statsSource.unrealizedGains || 0),
    },
    portfolioAllocation: Array.isArray(overview.allocation)
      ? overview.allocation.map((item: any) => ({
        name: item.category || item.name || "Asset",
        value: item.percentage || item.value || 0,
        color: item.color
      }))
      : (Array.isArray(overview.portfolioAllocation) ? overview.portfolioAllocation : []),
    performanceData: Array.isArray(overview.performance?.series)
      ? overview.performance.series.map((item: any) => ({
        name: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short' }) : (item.name || "Jan"),
        value: item.value || 0,
      }))
      : (Array.isArray(overview.performanceData) ? overview.performanceData : []),
    investments: Array.isArray(root?.investments?.investments)
      ? root.investments.investments.map((inv: any) => ({
        name: inv.assetName || inv.name || "Asset",
        id: inv.assetId || inv.id || "",
        tokens: inv.tokensOwned || inv.tokens || 0,
        invested: formatUSD(inv.amountInvested || inv.invested || 0),
        value: formatUSD(inv.currentValue || inv.value || 0),
        return: formatPercent(inv.totalReturnPercent || inv.return || 0),
        gain: formatUSD(inv.unrealizedGain || inv.gain || 0),
        status: typeof inv.status === "string" ? inv.status : "Active",
      }))
      : Array.isArray(root?.investments)
        ? root.investments.map((inv: any) => ({
          name: inv.assetName || inv.name || "Asset",
          id: inv.assetId || inv.id || "",
          tokens: inv.tokensOwned || inv.tokens || 0,
          invested: formatUSD(inv.amountInvested || inv.invested || 0),
          value: formatUSD(inv.currentValue || inv.value || 0),
          return: formatPercent(inv.totalReturnPercent || inv.return || 0),
          gain: formatUSD(inv.unrealizedGain || inv.gain || 0),
          status: typeof inv.status === "string" ? inv.status : "Active",
        }))
        : [],
    transactions: Array.isArray(root?.transactions?.transactions)
      ? root.transactions.transactions.map((tx: any) => ({
        type: typeof tx.type === "string" ? tx.type : "Investment",
        asset: tx.assetName || (typeof tx.asset === "string" ? tx.asset : (tx.asset?.name || "")),
        amount: `${tx.type === "Investment" ? "-" : "+"}${formatUSD(tx.amount || 0)}`,
        date: tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : (tx.date || "N/A"),
        status: typeof tx.status === "string" ? tx.status : "Completed",
      }))
      : Array.isArray(root?.transactions)
        ? root.transactions.map((tx: any) => ({
          type: typeof tx.type === "string" ? tx.type : "Investment",
          asset: tx.assetName || (typeof tx.asset === "string" ? tx.asset : (tx.asset?.name || "")),
          amount: `${tx.type === "Investment" ? "-" : "+"}${formatUSD(tx.amount || 0)}`,
          date: tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : (tx.date || "N/A"),
          status: typeof tx.status === "string" ? tx.status : "Completed",
        }))
        : [],
    compliance: Array.isArray(root?.compliance?.checks)
      ? root.compliance.checks.map((item: any) => ({
        label: item.title || item.label || "",
        status: item.status || "Pending",
        date: item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : (item.date || "N/A"),
        desc: item.description || item.desc || "",
        key: item.key,
        canApprove: item.canApprove,
        rawStatus: item.rawStatus,
      }))
      : (Array.isArray(root?.compliance) ? root.compliance : [])
  };
}

export const investorsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getInvestors: builder.query<InvestorListItem[], InvestorsQueryParams | void>({
      query: (params) => ({
        url: "/admin/investors",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        const list = extractArray(response);
        return list.map((item: any) => {
          const summary = item.summary || {};
          const formatUSD = (val: any) => {
            if (val === null || val === undefined) return "$0";
            if (typeof val === "string") return val.startsWith("$") ? val : `$${val}`;
            return `$${Number(val).toLocaleString()}`;
          };
          const name = item.name || "Unknown Investor";
          const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
          return {
            id: item.id || "",
            name: name,
            email: item.email || "",
            country: item.country || item.location || "Unknown",
            kycStatus: item.kycStatusLabel || item.kycStatus || "Pending",
            portfolioValue: formatUSD(summary.portfolioValue || 0),
            invested: formatUSD(summary.totalInvested || 0),
            joined: item.joinedAt ? new Date(item.joinedAt).toLocaleDateString() : "N/A",
            initials: initials,
            color: "bg-[var(--shell-active)]",
          };
        });
      },
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
      transformResponse: (response: any, meta, arg) => {
        const root = response?.data ?? response;
        return mapInvestorDetail(root, arg);
      }
    }),
    getInvestorCompliance: builder.query<InvestorComplianceItem[], string>({
      query: (id) => `/admin/investors/${id}/compliance`,
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        const checks = root?.checks || extractArray(root);
        return checks.map((item: any) => ({
          label: item.title || item.label || "",
          status: item.status || "Pending",
          date: item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : (item.date || "N/A"),
          desc: item.description || item.desc || "",
        }));
      },
      providesTags: (result, error, id) => [{ type: "User", id: `${id}_compliance` }],
    }),
    getInvestorInit: builder.query<InvestorInitResponse, string>({
      query: (id) => `/admin/investors/${id}/init`,
      providesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: `${id}_init` },
      ],
      transformResponse: (response: any, meta, arg) => {
        const root = response?.data ?? response;
        const investor = mapInvestorDetail(root, arg);
        return {
          investor,
          compliance: investor.compliance,
          investments: investor.investments,
        };
      }
    }),
    getInvestorInvestments: builder.query<InvestorInvestment[], string>({
      query: (id) => `/admin/investors/${id}/investments`,
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        const list = root?.investments || extractArray(root);
        const formatUSD = (val: any) => {
          if (val === null || val === undefined) return "$0";
          if (typeof val === "string") return val.startsWith("$") ? val : `$${val}`;
          return `$${Number(val).toLocaleString()}`;
        };
        const formatPercent = (val: any) => {
          if (val === null || val === undefined) return "+0%";
          const num = Number(val);
          return `${num >= 0 ? "+" : ""}${num}%`;
        };
        return list.map((inv: any) => ({
          name: inv.assetName || inv.name || "Asset",
          id: inv.assetId || inv.id || "",
          tokens: inv.tokensOwned || inv.tokens || 0,
          invested: formatUSD(inv.amountInvested || inv.invested || 0),
          value: formatUSD(inv.currentValue || inv.value || 0),
          return: formatPercent(inv.totalReturnPercent || inv.return || 0),
          gain: formatUSD(inv.unrealizedGain || inv.gain || 0),
          status: inv.status || "Active",
        }));
      },
      providesTags: (result, error, id) => [{ type: "User", id: `${id}_investments` }],
    }),
    getInvestorOverview: builder.query<InvestorOverviewResponse, string>({
      query: (id) => `/admin/investors/${id}/overview`,
      providesTags: (result, error, id) => [{ type: "User", id: `${id}_overview` }],
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        const header = root?.header || root || {};
        const summary = header.summary || root.summary || {};
        return {
          name: header.name || "Unknown",
          email: header.email || "",
          country: header.country || header.location || "Unknown",
          joined: header.joinedAt ? new Date(header.joinedAt).toLocaleDateString() : (header.joined || "N/A"),
          kycStatus: header.kycStatusLabel || header.kycStatus || header.status || "Pending",
          activeInvestments: summary.activeInvestments || 0,
          portfolioValue: summary.portfolioValue !== undefined ? `$${Number(summary.portfolioValue).toLocaleString()}` : "$0",
        };
      }
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
    approveInvestorCompliance: builder.mutation<void, { id: string; key: string }>({
      query: ({ id, key }) => ({
        url: `/admin/investors/${id}/${key}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
        { type: "User", id: `${id}_init` },
        { type: "User", id: `${id}_compliance` },
        { type: "User", id: `${id}_overview` },
      ],
    }),
    rejectInvestorCompliance: builder.mutation<void, { id: string; key: string; reason: string }>({
      query: ({ id, key, reason }) => ({
        url: `/admin/investors/${id}/${key}/reject`,
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
    setInvestorComplianceUnderReview: builder.mutation<void, { id: string; key: string }>({
      query: ({ id, key }) => ({
        url: `/admin/investors/${id}/${key}/under-review`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "INVESTORS_LIST" },
        { type: "User", id: `${id}_init` },
        { type: "User", id: `${id}_compliance` },
        { type: "User", id: `${id}_overview` },
      ],
    }),
    getInvestorTransactions: builder.query<InvestorTransaction[], string>({
      query: (id) => `/admin/investors/${id}/transactions`,
      transformResponse: (response: any) => {
        const root = response?.data ?? response;
        const list = root?.transactions || extractArray(root);
        const formatUSD = (val: any) => {
          if (val === null || val === undefined) return "$0";
          if (typeof val === "string") return val.startsWith("$") ? val : `$${val}`;
          return `$${Number(val).toLocaleString()}`;
        };
        return list.map((tx: any) => ({
          type: typeof tx.type === "string" ? tx.type : "Investment",
          asset: tx.assetName || (typeof tx.asset === "string" ? tx.asset : (tx.asset?.name || "")),
          amount: `${tx.type === "Investment" ? "-" : "+"}${formatUSD(tx.amount || 0)}`,
          date: tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : (tx.date || "N/A"),
          status: typeof tx.status === "string" ? tx.status : "Completed",
        }));
      },
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
  useApproveInvestorComplianceMutation,
  useRejectInvestorComplianceMutation,
  useSetInvestorComplianceUnderReviewMutation,
  useGetInvestorTransactionsQuery,
} = investorsApi;
