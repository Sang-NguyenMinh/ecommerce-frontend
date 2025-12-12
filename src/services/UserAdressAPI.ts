import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';
import { get } from 'http';

const USER_ADDRESS_URL = `${API_URL}/user-address`;

export interface IQueryUserAddress extends IBaseQuery {}

export const UserAddressAPI = {
  getAll: (params: IQueryUserAddress = {}) => {
    return axios.get(`${USER_ADDRESS_URL}`, { params });
  },

  createOne: (data: FormData) => {
    return axios.post(`${USER_ADDRESS_URL}`, data);
  },

  getOne: (id: string) => {
    return axios.get(`${USER_ADDRESS_URL}/${id}`);
  },

  getUserAddresses: () => {
    return axios.get(`${USER_ADDRESS_URL}`);
  },

  updateOne: (id: string, data: FormData) => {
    return axios.patch(`${USER_ADDRESS_URL}/${id}`, data);
  },

  deleteOne: (id: string) => {
    return axios.delete(`${USER_ADDRESS_URL}/${id}`);
  },
};
