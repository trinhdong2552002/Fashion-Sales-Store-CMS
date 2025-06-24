import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const districtApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDistricts: builder.query({
      query: ({ page, size }) => ({
        url: `/v1/private/districts`,
        method: "GET",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.DISTRICT],
    }),
    listDistrictsByProvince: builder.query({
      query: ({ provinceId, page, size }) => ({
        url: `/v1/private/provinces/${provinceId}/districts`,
        method: "GET",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.DISTRICT],
    }),
    listWardsByDistrict: builder.query({
      query: ({ districtId, page, size }) => ({
        url: `/v1/private/districts/${districtId}/wards`,
        method: "GET",
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.WARD],
    }),
  }),
});

export const {
  useListDistrictsQuery,
  useListDistrictsByProvinceQuery,
  useListWardsByDistrictQuery,
} = districtApi;
