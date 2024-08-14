import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/`,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");

    headers.set("Access-Control-Allow-Credentials", "true");
    const token = Cookies.get("token");
    //console.log("token in apislice", token);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<
      any,
      { email: string; password: string; firstName: string; lastName: string }
    >({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<
      {
        message: string;
        user: {
          firstName: string;
          lastName: string;
          email: string;
          _id: string;
          token: string;
        };
      },
      { userId: string; otp: string }
    >({
      query: ({ userId, otp }) => ({
        url: `auth/verify-otp/${userId}`,
        method: "POST",
        body: { otp: Number(otp) },
      }),
    }),
    resendOtp: builder.mutation<{ message: string }, { userId: string }>({
      query: (body) => ({
        url: "auth/resend-otp",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} = apiSlice;
