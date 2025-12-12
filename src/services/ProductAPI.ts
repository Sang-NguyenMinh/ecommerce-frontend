import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';

const PRODUCT_URL = `${API_URL}/product`;

export interface IQueryProduct extends IBaseQuery {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  productName?: string;
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
}

export const ProductAPI = {
  getAll: (params: IQueryProduct = {}) => {
    return axios.get(`${PRODUCT_URL}`, {
      params: { populate: ['categoryId'], ...params },
    });
  },

  getProductsByCategory: (categoryId: string, params: IQueryProduct = {}) => {
    return axios.get(`${PRODUCT_URL}`, {
      params: { categoryId, ...params },
    });
  },

  getOne: (id: string) => {
    return axios.get(`${PRODUCT_URL}/${id}`);
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
