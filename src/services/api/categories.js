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
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Optimistic Update
        const patchResult = dispatch(
          categoriesApi.util.updateQueryData(
            "listCategoriesForAdmin",
            (draft) => {
              if (draft) {
                const category = draft.find((item) => item.id === id);
                if (category) {
                  category.status = "INACTIVE"; // Update status to INACTIVE
                }
                return draft;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo(); // Hoàn tác nếu có lỗi
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
                  category.status = "ACTIVE"; // Update status to ACTIVE
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
