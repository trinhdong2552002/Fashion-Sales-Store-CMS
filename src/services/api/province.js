// services/api/province.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const provinceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProvinces: builder.query({
      query: ({ page, size }) => ({
        url: `/v1/private/provinces`,
        method: "GET",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.PROVINCE],
    }),

    listDistrictsByProvince: builder.query({
      query: ({ id, page, size }) => ({
        url: `/v1/private/provinces/${id}/districts`,
        method: "GET",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.PROVINCE],
    }),
  }),
});

export const { useListProvincesQuery, useListDistrictsByProvinceQuery } =
  provinceApi;
