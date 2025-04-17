import { API_URL } from "libs/env";
import { axios } from "../libs/custom-axios";

const USER_URL = `${API_URL}/user`;

export const UserAPI = {
  getUser: (token?: string) => {
    return axios.get(`${USER_URL}`, {
      headers: {
        ...(token &&
          token !== "" && {
            authorization: token.replace(/(\r\n|\n|\r)/gm, ""),
          }),
      },
    });
  },
};

export default UserAPI;
