import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
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
      query: () => "items",
      providesTags: ["User"],
    }),
    getUserChats: builder.query({
      query: () => "chats",
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
