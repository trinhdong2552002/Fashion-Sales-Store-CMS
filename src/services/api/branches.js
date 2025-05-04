import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBranches: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: "/v1/branches/admin",
        method: "GET",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.BRANCHES],
      transformResponse: (response) => {
        console.log("Raw branches response:", response);
        if (!response || !response.result) {
          console.warn("Invalid response structure:", response);
          return { items: [], totalItems: 0 };
        }

        const items = Array.isArray(response.result.items)
          ? response.result.items
          : Array.isArray(response.result)
          ? response.result
          : [];
        const totalItems = response.result.totalItems || 0;

        if (items.length === 0) {
          console.warn("No branches found in response");
        }

        return {
          items,
          totalItems,
          totalPages: response.result.totalPages || 1,
          page: response.result.page || 1,
          pageSize: response.result.pageSize || 10,
        };
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Transformed branches data:", data);
        } catch (error) {
          console.error("Error fetching branches:", {
            status: error.error?.status,
            data: error.error?.data,
            params: arg,
          });
        }
      },
      retry: (error) => error.status === 400,
      retryMax: 2,
    }),
    addBranch: builder.mutation({
      query: (branch) => ({
        url: "/v1/branches",
        method: "POST",
        data: branch,
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
      async onQueryStarted(branch, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            branchesApi.util.updateQueryData("listBranches", undefined, (draft) => {
              draft.items.push(data.result);
            })
          );
        } catch (error) {
          console.log("Error adding branch:", error);
        }
      },
    }),
    updateBranch: builder.mutation({
      query: ({ id, ...branch }) => ({
        url: `/v1/branches/${id}`,
        method: "PUT",
        data: branch,
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            branchesApi.util.updateQueryData("listBranches", undefined, (draft) => {
              const index = draft.items.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.items[index] = { ...draft.items[index], ...data.result };
              }
            })
          );
        } catch (error) {
          console.log("Error updating branch:", error);
        }
      },
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
            branchesApi.util.updateQueryData("listBranches", undefined, (draft) => {
              const index = draft.items.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.items[index].status = "INACTIVE";
              }
            })
          );
        } catch (error) {
          console.log("Error deleting branch:", error);
        }
      },
    }),
    restoreBranch: builder.mutation({
      query: (id) => ({
        url: `/v1/branches/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.BRANCHES],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            branchesApi.util.updateQueryData("listBranches", undefined, (draft) => {
              const index = draft.items.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.items[index].status = "ACTIVE";
              }
            })
          );
        } catch (error) {
          console.log("Error restoring branch:", error);
        }
      },
    }),
  }),
});

export const {
  useListBranchesQuery,
  useAddBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useRestoreBranchMutation,
} = branchesApi;