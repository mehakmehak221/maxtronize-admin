import { baseApi } from "./baseApi";

export interface LoginRequest {
  email: string;
  password?: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  role: string;
  id: string;
}

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
