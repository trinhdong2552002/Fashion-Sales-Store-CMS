import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tag-keys";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategoriesByAdmin: builder.query({
      query: ({ page, size, sort }) => ({
        url: "/v1/admin/categories",
        params: { page, size, sort },
      }),
      providesTags: [TAG_KEYS.CATEGORY],
    }),

    addCategories: builder.mutation({
      query: (category) => ({
        url: "/v1/admin/categories",
        method: "POST",
        data: {
          name: category.name,
          imageUrl: category.imageUrl,
        },
      }),
      invalidatesTags: [TAG_KEYS.CATEGORY],
    }),

    updateCategories: builder.mutation({
      query: ({ categoryId, ...category }) => ({
        url: `/v1/admin/categories/${categoryId}`,
        method: "PUT",
        data: category,
      }),
      invalidatesTags: [TAG_KEYS.CATEGORY],
    }),

    deleteCategories: builder.mutation({
      query: ({ categoryId }) => ({
        url: `/v1/admin/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.CATEGORY],
    }),

    restoreCategories: builder.mutation({
      query: ({ categoryId }) => ({
        url: `/v1/admin/categories/${categoryId}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.CATEGORY],
    }),
  }),
});

export const {
  useGetAllCategoriesByAdminQuery,
  useAddCategoriesMutation,
  useUpdateCategoriesMutation,
  useDeleteCategoriesMutation,
  useRestoreCategoriesMutation,
} = categoryApi;
