import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }, { dispatch }) => {
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
      if (
        error.status === 401 &&
        url !== "/v1/private/auth/logout" &&
        url !== "/v1/public/auth/refresh-token"
      ) {
        const currentRefreshToken = localStorage.getItem("refreshToken");

        if (currentRefreshToken) {
          if (isRefreshing) {
            try {
              const newToken = await new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              });

              const retryResult = await axios({
                url,
                method,
                data,
                params,
                headers: {
                  ...headers,
                  Authorization: `Bearer ${newToken}`,
                },
                baseURL: import.meta.env.VITE_API_URL,
              });

              return { data: retryResult.data };
            } catch (err) {
              return { error: err };
            }
          }

          isRefreshing = true;

          try {
            const refreshResult = await axios.post(
              "/v1/public/auth/refresh-token",
              { refreshToken: currentRefreshToken },
              { baseURL: import.meta.env.VITE_API_URL },
            );

            const newAccessToken = refreshResult.data?.result?.accessToken;
            if (newAccessToken) {
              const newRefreshToken =
                refreshResult.data.result.refreshToken || currentRefreshToken;

              localStorage.setItem("accessToken", newAccessToken);
              localStorage.setItem("refreshToken", newRefreshToken);

              processQueue(null, newAccessToken);

              const retryResult = await axios({
                url,
                method,
                data,
                params,
                headers: {
                  ...headers,
                  Authorization: `Bearer ${newAccessToken}`,
                },
                baseURL: import.meta.env.VITE_API_URL,
              });

              return { data: retryResult.data };
            }
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            processQueue(refreshError, null);
          } finally {
            isRefreshing = false;
          }
        }

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

        dispatch({ type: "RESET_STATE" });

        // Clear all auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("persist:root");

        window.location.href = "/";

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
