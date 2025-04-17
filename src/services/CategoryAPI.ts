import { API_URL } from "libs/env";
import { axios } from "../libs/custom-axios";
import { IBaseQuery, ICreateCategory } from "@/configs/types";

const CATEGORY_URL = `${API_URL}/product-category`;

export interface IQueryCategory extends IBaseQuery {}

export const CategoryAPI = {
  getAll: (params: IQueryCategory = {}) => {
    return axios.get(`${CATEGORY_URL}`, { params });
  },

  createCategory: (data: ICreateCategory) => {
    return axios.post(`${CATEGORY_URL}`, data);
  },
};
