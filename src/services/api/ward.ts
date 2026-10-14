import { TAG_KEYS } from "@/constants";
import { baseApi } from "./index";

export const wardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWards: builder.query({
      query: ({ pageNo, pageSize }) => ({
        url: `/v1/wards`,
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.WARD],
    }),
  }),
});

export const { useListWardsQuery } = wardApi;
