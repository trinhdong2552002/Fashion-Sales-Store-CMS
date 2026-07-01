import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tag-keys";

export const branchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBranchesByAdmin: builder.query({
      query: ({ page, size }) => ({
        url: "/v1/admin/branches",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.BRANCH],
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
      invalidatesTags: [TAG_KEYS.BRANCH],
    }),

    updateBranches: builder.mutation({
      query: ({ branchId, ...branch }) => ({
        url: `/v1/admin/branches/${branchId}`,
        method: "PUT",
        data: branch,
      }),
      invalidatesTags: [TAG_KEYS.BRANCH],
    }),

    deleteBranches: builder.mutation({
      query: ({ branchId }) => ({
        url: `/v1/admin/branches/${branchId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.BRANCH],
    }),

    restoreBranches: builder.mutation({
      query: ({ branchId }) => ({
        url: `/v1/admin/branches/${branchId}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.BRANCH],
    }),
  }),
});

export const {
  useGetAllBranchesByAdminQuery,
  useAddBranchesMutation,
  useUpdateBranchesMutation,
  useDeleteBranchesMutation,
  useRestoreBranchesMutation,
} = branchApi;
