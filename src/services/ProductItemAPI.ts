import { API_URL } from "libs/env";
import { axios } from "../libs/custom-axios";
import { IBaseQuery } from "@/configs/types";

const PRODUCT_ITEM_URL = `${API_URL}/product-item`;

export interface IQueryProductItem extends IBaseQuery {
  productId?: string;
}

export const ProductItemAPI = {
  getAll: (params: IQueryProductItem = {}) => {
    return axios.get(`${PRODUCT_ITEM_URL}`, { params });
  },

  createOne: (formData: FormData) => {
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    return axios.post(`${PRODUCT_ITEM_URL}`, formData);
  },
  //   updateOne: (id: string, data: IUpdateProduct) => {
  //     return axios.patch(`${PRODUCT_ITEM_URL}/${id}`, data);
  //   },

  deleteOne: (id: string) => {
    return axios.delete(`${PRODUCT_ITEM_URL}/${id}`);
  },
};
