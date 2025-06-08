import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';

const VARIATION_URL = `${API_URL}/variation`;

export interface IQueryVariation extends IBaseQuery {}

export const VariationAPI = {
  getAll: (params: IQueryVariation = {}) => {
    return axios.get(`${VARIATION_URL}`, { params });
  },

  createOne: (data: FormData) => {
    return axios.post(`${VARIATION_URL}`, data);
  },

  updateOne: (id: string, data: FormData) => {
    return axios.patch(`${VARIATION_URL}/${id}`, data);
  },

  deleteOne: (id: string) => {
    return axios.delete(`${VARIATION_URL}/${id}`);
  },
};
