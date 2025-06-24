import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategoriesForAdmin: builder.query({
      query: ({ page, size }) => ({
        url: "/v1/admin/categories",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.CATEGORIES],
    }),
    addCategories: builder.mutation({
      query: (category) => ({
        url: "/v1/admin/categories",
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
        url: `/v1/admin/categories/${id}`,
        method: "PUT",
        data: category,
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
    }),
    deleteCategories: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Optimistic Update
        const patchResult = dispatch(
          categoriesApi.util.updateQueryData(
            "listCategoriesForAdmin",
            (draft) => {
              if (draft) {
                const category = draft.find((item) => item.id === id);
                if (category) {
                  category.status = "INACTIVE";
                }
                return draft;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("Error deleting category:", error);
        }
      },
    }),
    restoreCategories: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/categories/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          categoriesApi.util.updateQueryData(
            "listCategoriesForAdmin",
            (draft) => {
              if (draft) {
                const category = draft.find((item) => item.id === id);
                if (category) {
                  category.status = "ACTIVE";
                }
                return draft;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("Error restoring category:", error);
        }
      },
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
