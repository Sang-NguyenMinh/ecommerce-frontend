import { ProductItemAPI } from "services/ProductItemAPI";
import {
  useCreateItem,
  useDeleteItem,
  useFetchList,
  useUpdateItem,
} from "../base";

const PRODUCT_ITEM_KEY = ["product-items"];

export const useProductItems = (params?: any) =>
  useFetchList(
    ["product-items", params?.productId],
    ProductItemAPI,
    undefined,
    params
  );

export const useCreateProductItem = () =>
  useCreateItem(
    PRODUCT_ITEM_KEY,
    ProductItemAPI,
    "Tạo biến thể sản phẩm thành công!",
    "Tạo biến thể sản phẩm thất bại!"
  );

export const useUpdateProductItem = () =>
  useUpdateItem(
    PRODUCT_ITEM_KEY,
    ProductItemAPI,
    "Cập nhật biến thể sản phẩm thành công!",
    "Cập nhật biến thể sản phẩm thất bại!"
  );

export const useDeleteProductItem = () =>
  useDeleteItem(
    PRODUCT_ITEM_KEY,
    ProductItemAPI,
    "Xóa biến thể sản phẩm thành công!",
    "Xóa biến thể sản phẩm thất bại!"
  );
