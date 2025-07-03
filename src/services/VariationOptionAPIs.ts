import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';

const VARIATION_OPTION_URL = `${API_URL}/variation_option`;

export interface IQueryVariationOption extends IBaseQuery {
  variationId?: string;
}

export const VariationOptionAPIs = {
  getAll: (params: IQueryVariationOption = {}) => {
    console.log('params', params);
    return axios.get(`${VARIATION_OPTION_URL}`, { params });
  },

  createOne: (data: FormData) => {
    return axios.post(`${VARIATION_OPTION_URL}`, data);
  },

  updateOne: (id: string, data: FormData) => {
    return axios.patch(`${VARIATION_OPTION_URL}/${id}`, data);
  },

  deleteOne: (id: string) => {
    return axios.delete(`${VARIATION_OPTION_URL}/${id}`);
  },

  getByCategoryId: (id: string) => {
    return axios.get(`${VARIATION_OPTION_URL}/by_category/${id}`);
  },
};
