import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listRoles: builder.query({
      query: ({ page, size } = {}) => ({
        url: `/v1/roles`,
        params: { page, size },
      }),
      providesTags: [TAG_KEYS.ROLE],
    }),
  }),
});

export const { useListRolesQuery } = roleApi;
