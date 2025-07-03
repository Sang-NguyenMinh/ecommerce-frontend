import { PromotionCategoryAPI } from '@/services/PromotionCategoryAPIs';
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useUpdateItem,
} from '../base';

const PROMOTION_CATEGORY_KEY = ['promotion-categories'];

export const usePromotionCategories = () =>
  useFetchList(PROMOTION_CATEGORY_KEY, PromotionCategoryAPI);

export const useCreatePromotionCategory = () =>
  useCreateItem(
    PROMOTION_CATEGORY_KEY,
    PromotionCategoryAPI,
    'Tạo khuyến mãi danh mục thành công!',
    'Tạo khuyến mãi danh mục thất bại!',
  );

export const useUpdatePromotionCategory = () =>
  useUpdateItem(
    PROMOTION_CATEGORY_KEY,
    PromotionCategoryAPI,
    'Cập nhật khuyến mãi danh mục thành công!',
    'Cập nhật khuyến mãi danh mục thất bại!',
  );

export const useDeletePromotionCategory = () =>
  useDeleteItem(
    PROMOTION_CATEGORY_KEY,
    PromotionCategoryAPI,
    'Xóa khuyến mãi danh mục thành công!',
    'Xóa khuyến mãi danh mục thất bại!',
  );
