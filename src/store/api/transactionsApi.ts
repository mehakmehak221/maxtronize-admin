import { baseApi } from "./baseApi";

export interface TransactionItem {
  id: string;
  type: string;
  asset: string;
  investor: string;
  amount: string;
  fee: string;
  status: string;
  date: string;
}

export interface TransactionsQueryParams {
  page?: any;
  limit?: any;
  type?: string;
  status?: string;
  search?: string;
}

function extractArray(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.transactions)) return response.transactions;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.list)) return response.list;
  const arrays = Object.values(response).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  return [];
}

function mapTransaction(tx: any): TransactionItem {
  return {
    id: tx.id || tx.transactionId || "",
    type: tx.type || tx.transactionType || "Investment",
    asset: tx.asset?.name || tx.assetName || tx.asset || "",
    investor: tx.investor?.name || tx.investorName || tx.investor || tx.user?.name || "",
    amount: typeof tx.amount === "number"
      ? `$${tx.amount.toLocaleString()}`
      : tx.amount || "$0",
    fee: typeof tx.fee === "number"
      ? `$${tx.fee.toLocaleString()}`
      : tx.fee || "$0",
    status: tx.status || "Pending",
    date: tx.createdAt
      ? new Date(tx.createdAt).toLocaleString()
      : tx.date || "",
  };
}

export const transactionsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionItem[], TransactionsQueryParams | void>({
      query: (params) => ({
        url: "/admin/transactions",
        params: params || {},
      }),
      transformResponse: (response: any) =>
        extractArray(response).map(mapTransaction),
      providesTags: [{ type: "Transaction", id: "LIST" }],
    }),
    getRecentTransactions: builder.query<TransactionItem[], { limit?: number } | void>({
      query: (params) => ({
        url: "/admin/transactions/recent",
        params: params || {},
      }),
      transformResponse: (response: any) =>
        extractArray(response).map(mapTransaction),
      providesTags: [{ type: "Transaction", id: "RECENT" }],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetRecentTransactionsQuery,
} = transactionsApi;
