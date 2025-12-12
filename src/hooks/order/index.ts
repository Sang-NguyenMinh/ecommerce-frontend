import { ShopOrderAPI } from '@/services/ShopOrderAPI';
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useFetchOne,
  useUpdateItem,
} from '../base';
import {
  useMutation,
  UseQueryOptions,
  useQuery,
  QueryKey,
} from '@tanstack/react-query';
import { message } from 'antd';

const SHOP_ORDER_KEY = ['shop-order'];

export const useShopOrders = () => useFetchList(SHOP_ORDER_KEY, ShopOrderAPI);

export const useShopOrder = (id?: string) =>
  useFetchOne([SHOP_ORDER_KEY, id], ShopOrderAPI, { enabled: !!id }, id);

export const useCreateShopOrder = () =>
  useCreateItem(
    SHOP_ORDER_KEY,
    ShopOrderAPI,
    'Tạo đơn hàng thành công!',
    'Tạo đơn hàng thất bại!',
  );

export const useTrackGuestOrder = () => {
  return useMutation({
    mutationFn: (data: { orderToken: string; guestEmail: string }) =>
      ShopOrderAPI.trackGuestOrder(data),
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ?? 'Không tìm thấy đơn hàng',
      );
    },
  });
};

export const useGetOrderByUserId = (userId?: string) => {
  return useQuery({
    queryKey: [...SHOP_ORDER_KEY, userId],
    enabled: !!userId,
    queryFn: async () => {
      const response = await ShopOrderAPI.getOrderByUserId(userId ?? '');
      return response?.data;
    },
  });
};

export const useTrackGuestOrderByOrderId = () => {
  return useMutation({
    mutationFn: (orderId: string) =>
      ShopOrderAPI.trackGuestOrderByOrderId(orderId),
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ?? 'Không tìm thấy đơn hàng',
      );
    },
  });
};

export const useUpdateShopOrder = () =>
  useUpdateItem(
    SHOP_ORDER_KEY,
    ShopOrderAPI,
    'Cập nhật đơn hàng thành công!',
    'Cập nhật đơn hàng thất bại!',
  );

export const useDeleteShopOrder = () =>
  useDeleteItem(
    SHOP_ORDER_KEY,
    ShopOrderAPI,
    'Xóa đơn hàng thành công!',
    'Xóa đơn hàng thất bại!',
  );
