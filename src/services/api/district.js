import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const districtApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDistricts: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: `/v1/districts`,
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.DISTRICT],
    }),
    listWardsByDistrict: builder.query({
      query: ({ id, pageNo, pageSize }) => ({
        url: `/v1/districts/${id}/wards`,
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.DISTRICT],
    }),
  }),
});

export const { useListDistrictsQuery, useListWardsByDistrictQuery } =
  districtApi;
