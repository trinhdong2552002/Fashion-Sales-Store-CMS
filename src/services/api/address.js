import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAddressForAdmin: builder.query({
      query: ({ page, size }) => ({
        url: `/v1/admin/addresses`,
        method: "GET",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.ADDRESS],
    }),
    deleteAddress: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          addressApi.util.updateQueryData("listAddressForAdmin", (draft) => {
            if (draft) {
              const address = draft.find((item) => item.id === id);
              if (address) {
                address.status = "INACTIVE";
              }
              return draft;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("Error deleting address:", error);
        }
      },
    }),
    restoreAddress: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/admin/addresses/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          addressApi.util.updateQueryData("listAddressForAdmin", (draft) => {
            if (draft) {
              const address = draft.find((item) => item.id === id);
              if (address) {
                address.status = "ACTIVE";
              }
              return draft;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log("Error restoring address:", error);
        }
      },
    }),
  }),
});

export const {
  useListAddressForAdminQuery,
  useDeleteAddressMutation,
  useRestoreAddressMutation,
} = addressApi;
