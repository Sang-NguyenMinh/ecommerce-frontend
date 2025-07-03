import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useUpdateItem,
} from '../base';
import { PromotionAPI } from '@/services/PromotionAPIs';

const PROMOTION_KEY = ['promotions'];

export const usePromotions = () => useFetchList(PROMOTION_KEY, PromotionAPI);

export const useCreatePromotion = () =>
  useCreateItem(
    PROMOTION_KEY,
    PromotionAPI,
    'Tạo khuyến mãi thành công!',
    'Tạo khuyến mãi thất bại!',
  );

export const useUpdatePromotion = () =>
  useUpdateItem(
    PROMOTION_KEY,
    PromotionAPI,
    'Cập nhật khuyến mãi thành công!',
    'Cập nhật khuyến mãi thất bại!',
  );

export const useDeletePromotion = () =>
  useDeleteItem(
    PROMOTION_KEY,
    PromotionAPI,
    'Xóa khuyến mãi thành công!',
    'Xóa khuyến mãi thất bại!',
  );
