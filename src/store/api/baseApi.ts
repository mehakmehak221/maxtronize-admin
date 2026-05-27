import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
  if (url) return url;
  if (typeof window !== "undefined") return "";
  return process.env.API_BASE_URL?.replace(/\/$/, "") ?? "";
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: "include",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("maxtronize-admin-token");
        if (token) headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User", "Issuer", "Asset", "Transaction", "Compliance", "Rbac", "Yield"],
  endpoints: () => ({}),
});
