import { useFetchOne } from './../base/index';
import { IQueryProduct, ProductAPI } from 'services/ProductAPI';
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useUpdateItem,
} from '../base';
import { useQuery } from '@tanstack/react-query';

const PRODUCT_KEY = ['product'];

export const useProducts = (params?: IQueryProduct) =>
  useFetchList(PRODUCT_KEY, ProductAPI, {}, params);

export const useCreateProduct = () =>
  useCreateItem(
    PRODUCT_KEY,
    ProductAPI,
    'Tạo sản phẩm thành công!',
    'Tạo sản phẩm thất bại!',
  );

export const useProductsByCategory = (
  categoryId: string,
  params?: IQueryProduct,
) => {
  return useQuery({
    queryKey: [...PRODUCT_KEY, 'byCategory', categoryId, params],
    queryFn: async () => {
      const res = await ProductAPI.getProductsByCategory(categoryId, params);
      return res?.data;
    },
  });
};

export const useProduct = (id: string) =>
  useFetchOne([PRODUCT_KEY, id], ProductAPI, { enabled: !!id }, id);
export const useUpdateProduct = () =>
  useUpdateItem(
    PRODUCT_KEY,
    ProductAPI,
    'Cập nhật sản phẩm thành công!',
    'Cập nhật sản phẩm thất bại!',
  );

export const useDeleteProduct = () =>
  useDeleteItem(
    PRODUCT_KEY,
    ProductAPI,
    'Xóa sản phẩm thành công!',
    'Xóa sản phẩm thất bại!',
  );
