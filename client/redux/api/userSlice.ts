import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/`,
  credentials: "include",
});

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => "users/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: (updatedUser) => ({
        url: "users/profile",
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["User"],
    }),
    getUserItems: builder.query({
      query: () => "/users/items",
      providesTags: ["User"],
    }),
    getUserChats: builder.query({
      query: () => "/users/chats",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserItemsQuery,
  useGetUserChatsQuery,
} = userApi;
