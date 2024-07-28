import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: ``,
  prepareHeaders: (headers) => {
    // Get the token from local storage or any other source
    const token = localStorage.getItem("token");

    // If we have a token, set it in the headers
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: (builder) => ({
    getUser: builder.query<any, void>({
      query: () => "user",
    }),
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    googleLogin: builder.mutation<any, { tokenId: string }>({
      query: (data) => ({
        url: "google-login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetUserQuery, useLoginMutation, useGoogleLoginMutation } =
  apiSlice;
