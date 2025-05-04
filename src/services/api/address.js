import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: ({ pageNo = 1, pageSize = 100, sortBy = "" } = {}) => ({
        url: `/v1/addresses`,
        method: "GET",
        params: { pageNo, pageSize, sortBy },
      }),
      providesTags: [TAG_KEYS.ADDRESS],
      transformResponse: (response) => {
        console.log("Get Addresses API Response:", response);
        const items = Array.isArray(response.result?.items)
          ? response.result.items.map((address) => ({
              ...address,
              provinceName: address.province?.name || "",
              districtName: address.district?.name || "",
              wardName: address.ward?.name || "",
              provinceId: address.province?.id || "",
              districtId: address.district?.id || "",
              wardCode: address.ward?.code || "",
            }))
          : [];
        return {
          items,
          page: response.result?.page || 1,
          size: response.result?.size || 100,
          totalPages: response.result?.totalPages || 1,
          totalItems: response.result?.totalItems || 0,
        };
      },
    }),
    createAddress: builder.mutation({
      query: (addressData) => ({
        url: `/v1/addresses`,
        method: "POST",
        data: addressData,
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
    }),
    updateAddress: builder.mutation({
      query: ({ addressId, addressData }) => ({
        url: `/v1/addresses/${addressId}`,
        method: "PUT",
        data: addressData,
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/v1/addresses/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;