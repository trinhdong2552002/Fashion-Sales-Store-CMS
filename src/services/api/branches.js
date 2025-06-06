import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBranchesForAdmin: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: "/v1/branches/admin",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.BRANCHES],
    }),
    addBranch: builder.mutation({
      query: (branch) => ({
        url: "/v1/branches",
        method: "POST",
        data: branch,
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
    }),
    updateBranch: builder.mutation({
      query: ({ id, ...branch }) => ({
        url: `/v1/branches/${id}`,
        method: "PUT",
        data: branch,
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/v1/branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            branchesApi.util.updateQueryData(
              "listBranches",
              undefined,
              (draft) => {
                const index = draft.items.findIndex((item) => item.id === id);
                if (index !== -1) {
                  draft.items[index].status = "INACTIVE";
                }
              }
            )
          );
        } catch (error) {
          console.log("Error deleting branch:", error);
        }
      },
    }),
    restoreBranch: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/branches/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            branchesApi.util.updateQueryData(
              "listBranches",
              undefined,
              (draft) => {
                const index = draft.items.findIndex((item) => item.id === id);
                if (index !== -1) {
                  draft.items[index].status = "ACTIVE";
                }
              }
            )
          );
        } catch (error) {
          console.log("Error restoring branch:", error);
        }
      },
    }),
  }),
});

export const {
  useListBranchesForAdminQuery,
  useAddBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useRestoreBranchMutation,
} = branchesApi;
