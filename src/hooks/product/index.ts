import { ProductAPI } from "services/ProductAPI";
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useUpdateItem,
} from "../base";

const PRODUCT_KEY = ["products"];

export const useProducts = () => useFetchList(PRODUCT_KEY, ProductAPI);

export const useCreateProduct = () =>
  useCreateItem(
    PRODUCT_KEY,
    ProductAPI,
    "Tạo sản phẩm thành công!",
    "Tạo sản phẩm thất bại!"
  );

export const useUpdateProduct = () =>
  useUpdateItem(
    PRODUCT_KEY,
    ProductAPI,
    "Cập nhật sản phẩm thành công!",
    "Cập nhật sản phẩm thất bại!"
  );

export const useDeleteProduct = () =>
  useDeleteItem(
    PRODUCT_KEY,
    ProductAPI,
    "Xóa sản phẩm thành công!",
    "Xóa sản phẩm thất bại!"
  );
