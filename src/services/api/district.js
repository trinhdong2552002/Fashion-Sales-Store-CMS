import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const districtApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDistricts: builder.query({
      query: ({ page, size }) => ({
        url: `/v1/private/districts`,
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.DISTRICT],
    }),
    listWardsByDistrict: builder.query({
      query: ({ id, page, size }) => ({
        url: `/v1/private/districts/${id}/wards`,
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.DISTRICT],
    }),
   
  }),
});

export const {
  useListDistrictsQuery,
  useListWardsByDistrictQuery,
} = districtApi;
