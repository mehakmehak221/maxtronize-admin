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
  const root = response?.data ?? response;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (Array.isArray(root.transactions)) return root.transactions;
  if (Array.isArray(root.results)) return root.results;
  if (Array.isArray(root.list)) return root.list;
  const arrays = Object.values(root).filter(Array.isArray);
  if (arrays.length > 0) return arrays[0] as any[];
  return [];
}

function mapTransaction(tx: any): TransactionItem {
  const assetName =
    tx.asset?.name ||
    tx.assetName ||
    (typeof tx.asset === "string" ? tx.asset : "") ||
    "";

  const investorName =
    tx.investor?.name ||
    tx.investorName ||
    (typeof tx.investor === "string" ? tx.investor : "") ||
    tx.user?.name ||
    tx.user?.email ||
    "";

  return {
    id: tx.txId || tx.id || tx.transactionId || "",
    type: tx.typeLabel || tx.type || tx.transactionType || "Investment",
    asset: assetName,
    investor: investorName,
    amount: typeof tx.amount === "number"
      ? `$${tx.amount.toLocaleString()}`
      : typeof tx.amount === "string"
        ? tx.amount
        : "$0",
    fee: typeof tx.fee === "number"
      ? `$${tx.fee.toLocaleString()}`
      : typeof tx.fee === "string"
        ? tx.fee
        : "$0",
    status: tx.statusLabel || tx.status || "Pending",
    date: (() => {
      const raw = tx.occurredAt && typeof tx.occurredAt === "string" ? tx.occurredAt
        : tx.createdAt && typeof tx.createdAt === "string" ? tx.createdAt
          : typeof tx.date === "string" ? tx.date
            : "";
      if (!raw) return "";
      const d = new Date(raw);
      return isNaN(d.getTime()) ? "" : d.toLocaleString();
    })(),
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
