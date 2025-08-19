// services/api/province.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const provinceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProvinces: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: `/v1/provinces`,
        method: "GET",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.PROVINCE],
    }),

    listDistrictsByProvince: builder.query({
      query: ({ id, pageBo, pageSize }) => ({
        url: `/v1/provinces/${id}/districts`,
        method: "GET",
        params: { pageBo, pageSize },
      }),
      providesTags: [TAG_KEYS.PROVINCE],
    }),
  }),
});

export const { useListProvincesQuery, useListDistrictsByProvinceQuery } =
  provinceApi;
