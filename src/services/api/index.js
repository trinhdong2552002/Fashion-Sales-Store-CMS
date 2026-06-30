import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }) => {
    const isPublicEndpoint = url.startsWith("/v1/public");

    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!isPublicEndpoint && !token && !refreshToken) {
      return {
        error: {
          status: 401,
          data: { message: "Không tìm thấy token, vui lòng đăng nhập lại" },
        },
      };
    }

    try {
      const result = await axios({
        url,
        method,
        data,
        params,
        headers: {
          ...headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        baseURL: import.meta.env.VITE_API_URL,
      });

      if (result.status >= 400) {
        console.log("Server error response:", result.data);
        return {
          error: {
            status: result.status,
            data: result.data,
          },
        };
      }

      return { data: result.data };
    } catch (axiosError) {
      const error = {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      };

      // HANDLE 401 / EXPIRED TOKEN HERE
      if (error.status === 401 && url !== "/v1/private/auth/logout") {
        const expiredToken = localStorage.getItem("accessToken");

        // Call logout API if token exists
        if (expiredToken) {
          try {
            await axios.post(
              "/v1/private/auth/logout",
              { accessToken: expiredToken },
              { baseURL: import.meta.env.VITE_API_URL },
            );
          } catch (logoutError) {
            console.error("Logout API call failed:", logoutError);
          }
        }

        // Clear all auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("persist:root");

        return { error };
      }

      return { error };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: [
    "Address",
    "Auth",
    "Branch",
    "Cart",
    "Category",
    "Color",
    "District",
    "Order",
    "Product",
    "Product_Variant",
    "File",
    "Promotion",
    "Province",
    "Review",
    "Role",
    "Size",
    "User",
    "Ward",
    "Statistics",
  ],
});
