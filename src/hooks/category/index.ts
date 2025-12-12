import { CategoryAPI } from 'services/CategoryAPI';
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useFetchOne,
  useUpdateItem,
} from '../base';

const CATEGORY_KEY = ['categories'];

export const useCategories = () => useFetchList(CATEGORY_KEY, CategoryAPI);

export const useCategory = (id?: string) =>
  useFetchOne([CATEGORY_KEY, id], CategoryAPI, { enabled: !!id }, id);

export const useCreateCategory = () =>
  useCreateItem(
    CATEGORY_KEY,
    CategoryAPI,
    'Tạo danh mục thành công!',
    'Tạo danh mục thất bại!',
  );

export const useUpdateCategory = () =>
  useUpdateItem(
    CATEGORY_KEY,
    CategoryAPI,
    'Cập nhật danh mục thành công!',
    'Cập nhật danh mục thất bại!',
  );

export const useDeleteCategory = () =>
  useDeleteItem(
    CATEGORY_KEY,
    CategoryAPI,
    'Xóa danh mục thành công!',
    'Xóa danh mục thất bại!',
  );
