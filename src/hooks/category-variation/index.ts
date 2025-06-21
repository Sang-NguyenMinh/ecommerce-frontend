import { CategoryVariationAPIs } from '@/services/CategoryVariationAPIs';
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useUpdateItem,
} from '../base';

const CATEGORY_VARIATION_KEY = ['category_variations'];

export const useCategoryVariations = (params?: any) =>
  useFetchList(
    CATEGORY_VARIATION_KEY,
    CategoryVariationAPIs,
    undefined,
    params,
  );

export const useCreateCategoryVariation = () =>
  useCreateItem(
    CATEGORY_VARIATION_KEY,
    CategoryVariationAPIs,
    'Tạo biến thể cho danh mục thành công!',
    'Tạo biến thể cho danh mục thất bại!',
  );

export const useUpdateCategoryVariation = () =>
  useUpdateItem(
    CATEGORY_VARIATION_KEY,
    CategoryVariationAPIs,
    'Cập nhật biến thể cho danh mục thành công!',
    'Cập nhật biến thể cho danh mục thất bại!',
  );

export const useDeleteCategoryVariation = () =>
  useDeleteItem(
    CATEGORY_VARIATION_KEY,
    CategoryVariationAPIs,
    'Xóa biến thể cho danh mục thành công!',
    'Xóa biến thể cho danh mục thất bại!',
  );
