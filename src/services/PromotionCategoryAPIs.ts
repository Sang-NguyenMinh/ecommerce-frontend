import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';

const PROMOTION_CATEGORY_URL = `${API_URL}/promotion-category`;

export interface IQueryPromotionCategory extends IBaseQuery {}

export const PromotionCategoryAPI = {
  getAll: (params: IQueryPromotionCategory = {}) => {
    return axios.get(`${PROMOTION_CATEGORY_URL}`, {
      params: {
        populate: ['promotionId', 'categoryId'],
        ...params,
      },
    });
  },

  createOne: (data: FormData) => {
    return axios.post(`${PROMOTION_CATEGORY_URL}`, data);
  },

  updateOne: (id: string, data: FormData) => {
    return axios.patch(`${PROMOTION_CATEGORY_URL}/${id}`, data);
  },

  deleteOne: (id: string) => {
    return axios.delete(`${PROMOTION_CATEGORY_URL}/${id}`);
  },
};
