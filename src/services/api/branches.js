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
    addBranches: builder.mutation({
      query: (branch) => ({
        url: "/v1/branches",
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
        url: `/v1/branches/${id}`,
        method: "PUT",
        data: branch,
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
    }),
    deleteBranches: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
    }),
    restoreBranches: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/branches/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
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
