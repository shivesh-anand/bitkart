import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Create a base query function with credentials set to 'include' to ensure cookies are sent with requests.
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include", // Ensures cookies are sent with the request
});

export const itemApi = createApi({
  reducerPath: "itemApi",
  baseQuery,
  tagTypes: ["Items"],
  endpoints: (builder) => ({
    getAllItems: builder.query({
      query: (params) => {
        const {
          search,
          category,
          minPrice,
          maxPrice,
          page,
          limit,
          format,
          width,
          height,
          quality,
        } = params;

        const queryParams = new URLSearchParams();

        if (search) queryParams.append("search", search);
        if (category) queryParams.append("category", category);
        if (minPrice) queryParams.append("minPrice", minPrice.toString());
        if (maxPrice) queryParams.append("maxPrice", maxPrice.toString());
        if (page) queryParams.append("page", page.toString());
        if (limit) queryParams.append("limit", limit.toString());
        if (format) queryParams.append("format", format);
        if (width) queryParams.append("width", width.toString());
        if (height) queryParams.append("height", height.toString());
        if (quality) queryParams.append("quality", quality.toString());

        //console.log(queryParams.toString());
        return `item/all?${queryParams.toString()}`;
      },
      providesTags: ["Items"],
    }),
    getItemById: builder.query({
      query: (id) => `item/${id}`,
      providesTags: ["Items"],
    }),
    createItem: builder.mutation({
      query: (newItem) => ({
        url: "item/",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Items"],
    }),
    updateItem: builder.mutation({
      query: ({ id, updatedItem }) => ({
        url: `item/${id}`,
        method: "PUT",
        body: updatedItem,
      }),
      invalidatesTags: ["Items"],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Items"],
    }),
    updateImages: builder.mutation({
      query: ({ id, formData }) => ({
        url: `item/${id}/images`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Items"],
    }),
    deleteImage: builder.mutation({
      query: ({ itemId, imageId }) => ({
        url: `item/${itemId}/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Items"],
    }),
  }),
});

export const {
  useGetAllItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useUpdateImagesMutation,
  useDeleteImageMutation,
} = itemApi;
