import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/`,
  credentials: "include",
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

        //console.log("Params:", params);

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

        const queryString = `item/all?${queryParams.toString()}`;
        //console.log("Query String:", queryString.toString());

        return queryString;
      },
      providesTags: ["Items"],
    }),
    getItemsOfUser: builder.query({
      query: () => `item/`,
      providesTags: ["Items"],
    }),
    getItemById: builder.query({
      query: (id) => `item/${id}?format=webp&quality=80`,
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
        method: "PATCH",
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
  useGetItemsOfUserQuery,
} = itemApi;
