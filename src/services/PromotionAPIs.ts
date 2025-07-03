import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';

const PROMOTION_URL = `${API_URL}/promotion`;

export interface IQueryPromotion extends IBaseQuery {}

export const PromotionAPI = {
  getAll: (params: IQueryPromotion = {}) => {
    return axios.get(`${PROMOTION_URL}`, { params });
  },

  createOne: (data: FormData) => {
    return axios.post(`${PROMOTION_URL}`, data);
  },

  updateOne: (id: string, data: FormData) => {
    return axios.patch(`${PROMOTION_URL}/${id}`, data);
  },

  deleteOne: (id: string) => {
    return axios.delete(`${PROMOTION_URL}/${id}`);
  },
};
