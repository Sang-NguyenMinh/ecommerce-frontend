import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { Storage } from "./storage";
import { extractResponseError } from "./utils";
import { IToken } from "configs/custom-types";

const axiosInstance = axios.create();
axiosInstance.defaults.timeout = 5 * 60 * 1000;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.headers) {
      try {
        const token = Storage.Cookie.get<IToken>("token");

        if (token && config.headers) {
          config.headers.authorization = [token.type, token.accessToken]
            .join(" ")
            .replace(/(\r\n|\n|\r)/gm, "");
        }
      } catch (err) {
        console.log(extractResponseError(err));
      }

      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
    }

    return config;
  },
  (error) => {
    let { response } = error;

    if (response && response.status === 401) {
      const oldAccessToken = `${
        response?.data?.config?.headers?.Authorization ?? ""
      }`.replace("Bearer ", "");
      const token = Storage.Cookie.get<IToken>("token");

      const originalRequest = error.config;

      if (
        (token && oldAccessToken === token.accessToken) ||
        !!originalRequest._retry
      ) {
        Storage.Cookie.remove("token");

        if (window.location.pathname !== "/auth/login")
          window.location.href = "/auth/login";
      } else {
        originalRequest._retry = true;
        return axiosInstance(originalRequest);
      }
    }

    return error;
  }
);

export { axiosInstance as axios };
