import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBranchesForAdmin: builder.query({
      query: ({ page, size }) => ({
        url: "/v1/admin/branches",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.BRANCHES],
    }),
    addBranches: builder.mutation({
      query: (branch) => ({
        url: "/v1/admin/branches",
        method: "POST",
        data: {
          name: branch.name,
          location: branch.location,
          phone: branch.phone,
        },
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
    }),
    updateBranches: builder.mutation({
      query: ({ id, ...branch }) => ({
        url: `/v1/admin/branches/${id}`,
        method: "PUT",
        data: branch,
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
    }),
    deleteBranches: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Optimistic Update
        const patchResult = dispatch(
          branchesApi.util.updateQueryData(
            "listBranchesForAdmin",
            undefined,
            (draft) => {
              if (draft) {
                const branches = draft.find((item) => item.id === id);
                if (branches) {
                  branches.status = "INACTIVE";
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
          console.log("Error deleting branches:", error);
        }
      },
    }),
    restoreBranches: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/branches/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
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
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("Error restoring branches:", error);
        }
      },
    }),
  }),
});

export const {
  useListBranchesForAdminQuery,
  useAddBranchesMutation,
  useUpdateBranchesMutation,
  useDeleteBranchesMutation,
  useRestoreBranchesMutation,
} = branchesApi;
