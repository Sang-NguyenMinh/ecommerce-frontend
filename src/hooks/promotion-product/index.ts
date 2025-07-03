import { PromotionProductAPI } from '@/services/PromotionProductAPIs';
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useUpdateItem,
} from '../base';

const PROMOTION_PRODUCT_KEY = ['promotion-products'];

export const usePromotionProducts = () =>
  useFetchList(PROMOTION_PRODUCT_KEY, PromotionProductAPI);

export const useCreatePromotionCategory = () =>
  useCreateItem(
    PROMOTION_PRODUCT_KEY,
    PromotionProductAPI,
    'Tạo khuyến mãi cho sản phẩm thành công!',
    'Tạo khuyến mãi cho sản phẩm thất bại!',
  );

export const useUpdatePromotionCategory = () =>
  useUpdateItem(
    PROMOTION_PRODUCT_KEY,
    PromotionProductAPI,
    'Cập nhật khuyến mãi cho sản phẩm thành công!',
    'Cập nhật khuyến mãi cho sản phẩm thất bại!',
  );

export const useDeletePromotionCategory = () =>
  useDeleteItem(
    PROMOTION_PRODUCT_KEY,
    PromotionProductAPI,
    'Xóa khuyến mãi cho sản phẩm thành công!',
    'Xóa khuyến mãi cho sản phẩm thất bại!',
  );
