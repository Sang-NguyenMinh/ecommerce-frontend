import { VariationOptionAPIs } from '@/services/VariationOptionAPIs';
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useUpdateItem,
} from '../base';
import { useQuery } from '@tanstack/react-query';

const VARIATION_OPTION_KEY = ['variation_options'];

export const useVariationOptions = (params?: any) =>
  useFetchList(VARIATION_OPTION_KEY, VariationOptionAPIs, undefined, params);

export const useCreateVariationOption = () =>
  useCreateItem(
    VARIATION_OPTION_KEY,
    VariationOptionAPIs,
    'Tạo tùy chọn biến thể thành công!',
    'Tạo tùy chọn biến thể thất bại!',
  );

export const useUpdateVariationOption = () =>
  useUpdateItem(
    VARIATION_OPTION_KEY,
    VariationOptionAPIs,
    'Cập nhật tùy chọn biến thể thành công!',
    'Cập nhật tùy chọn biến thể thất bại!',
  );

export const useDeleteVariationOption = () =>
  useDeleteItem(
    VARIATION_OPTION_KEY,
    VariationOptionAPIs,
    'Xóa tùy chọn biến thể thành công!',
    'Xóa tùy chọn biến thể thất bại!',
  );

export const useVariationOptionByCategoryId = (categoryId: string) => {
  return useQuery({
    queryKey: ['variation-options-by-category-id'],
    queryFn: async () => {
      const res = await VariationOptionAPIs.getByCategoryId(categoryId);
      return res?.data;
    },
  });
};
