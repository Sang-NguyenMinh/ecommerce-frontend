import { API_URL } from 'libs/env';
import { axios } from '../libs/custom-axios';
import { IBaseQuery } from '@/configs/types';

const SHOP_ORDER_URL = `${API_URL}/shop-order`;

export interface IQueryShopOrder extends IBaseQuery {}

export const ShopOrderAPI = {
  getAll: (params: IQueryShopOrder = {}) => {
    return axios.get(`${SHOP_ORDER_URL}`, { params });
  },

  createOne: (data: FormData) => {
    return axios.post(`${SHOP_ORDER_URL}`, data);
  },

  getOne: (id: string) => {
    return axios.get(`${SHOP_ORDER_URL}/${id}`);
  },

  updateOne: (id: string, data: FormData) => {
    return axios.patch(`${SHOP_ORDER_URL}/${id}`, data);
  },

  deleteOne: (id: string) => {
    return axios.delete(`${SHOP_ORDER_URL}/${id}`);
  },

  trackGuestOrder: (data: ITrackGuestOrder) => {
    return axios.post(`${SHOP_ORDER_URL}/track-guest`, data);
  },

  // ⭐ API lấy chi tiết đơn hàng
  getOrderDetails: (id: string) => {
    return axios.get(`${SHOP_ORDER_URL}/${id}/details`);
  },

  // ⭐ API lấy đơn hàng theo userId
  getUserOrders: (userId: string) => {
    return axios.get(`${SHOP_ORDER_URL}/user/${userId}`);
  },
  updateOrderStatus: (id: string, orderStatus: string) => {
    return axios.patch(`${SHOP_ORDER_URL}/${id}/status`, { orderStatus });
  },

  trackGuestOrderByOrderId: (orderId: string) => {
    return axios.post(`${SHOP_ORDER_URL}/track-guest-by-id`, { orderId });
  },

  getOrderByUserId: (userId: string) => {
    return axios.get(`${SHOP_ORDER_URL}/user/${userId}`);
  },

  checkOutOrder: (data: FormData) => {
    return axios.post(`${SHOP_ORDER_URL}/checkout`, data);
  },
};

export interface ITrackGuestOrder {
  orderToken: string;
  guestEmail: string;
}
