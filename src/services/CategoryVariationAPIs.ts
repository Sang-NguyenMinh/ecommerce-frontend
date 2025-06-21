import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';

const CATEGORY_VARIATION_URL = `${API_URL}/category-variation`;

export interface IQueryCategoryVariation extends IBaseQuery {}

export const CategoryVariationAPIs = {
  getAll: (params: IQueryCategoryVariation = {}) => {
    return axios.get(`${CATEGORY_VARIATION_URL}`, {
      params: {
        ...params,
        populate: ['variationId', 'categoryId'],
      },
    });
  },

  createOne: (data: FormData) => {
    return axios.post(`${CATEGORY_VARIATION_URL}`, data);
  },

  updateOne: (id: string, data: FormData) => {
    return axios.patch(`${CATEGORY_VARIATION_URL}/${id}`, data);
  },

  deleteOne: (id: string) => {
    return axios.delete(`${CATEGORY_VARIATION_URL}/${id}`);
  },
};
