import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';

const USER_URL = `${API_URL}/user`;

export const UserAPI = {
  getUser: () => {
    const res = axios.get(`${USER_URL}`);
    return res;
  },
};

export default UserAPI;
