import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query({
      query: () => ({
        url: "/v1/categories/admin",
        method: "GET",
      }),
      providesTags: [TAG_KEYS.CATEGORIES],
      transformResponse: (response) => ({
        items: Array.isArray(response.result?.items)
          ? response.result.items
          : response.result || [],
      }),
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: "/v1/categories",
        method: "POST",
        data: category,
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
      async onQueryStarted(category, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            categoryApi.util.updateQueryData("listCategories", undefined, (draft) => {
              draft.items.push(data.result);
            })
          );
        } catch (error) {
          console.log("Error adding category:", error);
        }
      },
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `/v1/categories/${id}`,
        method: "PUT",
        data: category,
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            categoryApi.util.updateQueryData("listCategories", undefined, (draft) => {
              const index = draft.items.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.items[index] = { ...draft.items[index], ...data.result };
              }
            })
          );
        } catch (error) {
          console.log("Error updating category:", error);
        }
      },
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/v1/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            categoryApi.util.updateQueryData("listCategories", undefined, (draft) => {
              const index = draft.items.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.items[index].status = "INACTIVE";
              }
            })
          );
        } catch (error) {
          console.log("Error deleting category:", error);
        }
      },
    }),
    restoreCategory: builder.mutation({
      query: (id) => ({
        url: `/v1/categories/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            categoryApi.util.updateQueryData("listCategories", undefined, (draft) => {
              const index = draft.items.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.items[index].status = "ACTIVE";
              }
            })
          );
        } catch (error) {
          console.log("Error restoring category:", error);
        }
      },
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
} = categoryApi;