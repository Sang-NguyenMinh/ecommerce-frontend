import { API_URL } from "libs/env";
import { axios } from "../libs/custom-axios";

const AUTH_URL = `${API_URL}/auth`;

export const AuthAPI = {
  logIn: (username: string, password: string) => {
    return axios.post(`${AUTH_URL}/login`, { username, password });
  },
};
