import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategoriesForAdmin: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: "/v1/categories/admin",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.CATEGORIES],
    }),
    addCategories: builder.mutation({
      query: (category) => ({
        url: "/v1/categories",
        method: "POST",
        data: {
          name: category.name,
          description: category.description,
        },
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
    }),
    updateCategories: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `/v1/categories/${id}`,
        method: "PUT",
        data: category,
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
    }),
    deleteCategories: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
    }),
    restoreCategories: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/categories/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
    }),
  }),
});

// TODO: Custom Hook
export const {
  useListCategoriesForAdminQuery,
  useAddCategoriesMutation,
  useUpdateCategoriesMutation,
  useDeleteCategoriesMutation,
  useRestoreCategoriesMutation,
} = categoriesApi;
