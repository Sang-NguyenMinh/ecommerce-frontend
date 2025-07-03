import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';

const PROMOTION_PRODUCT_URL = `${API_URL}/promotion-product`;

export interface IQueryPromotionProduct extends IBaseQuery {}

export const PromotionProductAPI = {
  getAll: (params: IQueryPromotionProduct = {}) => {
    return axios.get(`${PROMOTION_PRODUCT_URL}`, {
      params: {
        populate: ['promotionId', 'productId'],
        ...params,
      },
    });
  },

  createOne: (data: FormData) => {
    return axios.post(`${PROMOTION_PRODUCT_URL}`, data);
  },

  updateOne: (id: string, data: FormData) => {
    return axios.patch(`${PROMOTION_PRODUCT_URL}/${id}`, data);
  },

  deleteOne: (id: string) => {
    return axios.delete(`${PROMOTION_PRODUCT_URL}/${id}`);
  },
};
