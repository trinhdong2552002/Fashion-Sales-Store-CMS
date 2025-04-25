import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy danh sách địa chỉ của người dùng
    getAddresses: builder.query({
      query: ({ pageNo = 1, pageSize = 10, sortBy = "" } = {}) => ({
        url: `/v1/addresses`,
        method: "GET",
        params: { pageNo, pageSize, sortBy },
      }),
      providesTags: [TAG_KEYS.ADDRESS],
      transformResponse: (response) => {
        console.log("Get Addresses API Response:", response);
        // Ánh xạ dữ liệu để UI dễ sử dụng
        const items = Array.isArray(response.result?.items)
          ? response.result.items.map((address) => {
              console.log("Address item:", address); // Log để kiểm tra cấu trúc address
              return {
                ...address,
                provinceName: address.province?.name || address.province?.ProvinceName || "",
                districtName: address.district?.name || address.district?.DistrictName || "",
                wardName: address.ward?.name || address.ward?.WardName || "",
                provinceId: address.province?.id || address.province?.ProvinceID || "",
                districtId: address.district?.id || address.district?.DistrictID || "",
                wardCode: address.ward?.code || address.ward?.WardCode || "",
              };
            })
          : [];
        return {
          items,
          page: response.result?.page || 1,
          size: response.result?.size || 10,
          totalPages: response.result?.totalPages || 1,
          totalItems: response.result?.totalItems || 0,
        };
      },
    }),
    // Thêm địa chỉ mới
    createAddress: builder.mutation({
      query: (addressData) => ({
        url: `/v1/addresses`,
        method: "POST",
        data: addressData,
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
    }),
    // Cập nhật địa chỉ
    updateAddress: builder.mutation({
      query: ({ addressId, addressData }) => ({
        url: `/v1/addresses/${addressId}`,
        method: "PUT",
        data: addressData,
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
    }),
    // Xóa địa chỉ
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/v1/addresses/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.ADDRESS],
    }),
  }),
});

export const { useGetAddressesQuery, useCreateAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation } = addressApi;