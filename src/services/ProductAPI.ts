import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';

const PRODUCT_URL = `${API_URL}/product`;

export interface IQueryProduct extends IBaseQuery {}

export const ProductAPI = {
  getAll: (params: IQueryProduct = {}) => {
    return axios.get(`${PRODUCT_URL}`, { params });
  },

  createOne: (formData: FormData) => {
    return axios.post(`${PRODUCT_URL}`, formData);
  },

  updateOne: (id: string, data: FormData) => {
    return axios.patch(`${PRODUCT_URL}/${id}`, data);
  },

  deleteOne: (id: string) => {
    return axios.delete(`${PRODUCT_URL}/${id}`);
  },
};
