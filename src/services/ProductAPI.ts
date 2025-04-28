import { API_URL } from "libs/env";
import { axios } from "../libs/custom-axios";
import {
  IBaseQuery,
  ICreateCategory,
  ICreateProduct,
  IUpdateCategory,
} from "@/configs/types";

const PRODUCT_URL = `${API_URL}/product`;

export interface IQueryProduct extends IBaseQuery {}

export const ProductAPI = {
  getAll: (params: IQueryProduct = {}) => {
    return axios.get(`${PRODUCT_URL}`, { params });
  },

  createOne: (formData: FormData) => {
    console.log("FormData entriesapi:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    return axios.post(`${PRODUCT_URL}`, formData);
  },
  //   updateOne: (id: string, data: IUpdateProduct) => {
  //     return axios.patch(`${PRODUCT_URL}/${id}`, data);
  //   },

  deleteOne: (id: string) => {
    return axios.delete(`${PRODUCT_URL}/${id}`);
  },
};
