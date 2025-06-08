import { VariationAPI } from '@/services/VariationPAIs';
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useUpdateItem,
} from '../base';

const VARIATION_KEY = ['variations'];

export const useVariations = () => useFetchList(VARIATION_KEY, VariationAPI);

export const useCreateVariation = () =>
  useCreateItem(
    VARIATION_KEY,
    VariationAPI,
    'Tạo biến thể thành công!',
    'Tạo biến thể thất bại!',
  );

export const useUpdateVariation = () =>
  useUpdateItem(
    VARIATION_KEY,
    VariationAPI,
    'Cập nhật biến thể thành công!',
    'Cập nhật biến thể thất bại!',
  );

export const useDeleteVariation = () =>
  useDeleteItem(
    VARIATION_KEY,
    VariationAPI,
    'Xóa biến thể thành công!',
    'Xóa biến thể thất bại!',
  );
