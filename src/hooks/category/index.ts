import { ICreateCategory } from "@/configs/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { CategoryAPI, IQueryCategory } from "services/CategoryAPI";
import { message } from "antd";
export const useCategories = (
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) => {
  return useQuery<any>({
    ...options,
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await CategoryAPI.getAll();
      return res.data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ICreateCategory) => CategoryAPI.createCategory(body),
    onSuccess: () => {
      message.success("Tạo danh mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Tạo danh mục thất bại!");
    },
  });
};
