import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  QueryKey,
} from '@tanstack/react-query';
import { message } from 'antd';

type CrudService = {
  getAll?: (params?: any) => Promise<any>;
  getOne?: (id: string, params?: any) => Promise<any>;
  createOne?: (data: any) => Promise<any>;
  updateOne?: (id: string, data: any) => Promise<any>;
  deleteOne?: (id: string) => Promise<any>;
};

export const useFetchList = (
  key: QueryKey,
  api: CrudService,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
  params?: any,
) => {
  return useQuery({
    ...options,
    queryKey: [...key, params],
    queryFn: async () => {
      const response = await api.getAll?.(params);
      console.log('🔍 Type of response.data:', typeof response?.data);
      return response?.data;
    },
  });
};

export const useFetchOne = (
  key: QueryKey,
  api: CrudService,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>,
  id?: string,
) => {
  console.log('useFetchOne id', id);
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      const res = await api.getOne?.(id);
      return res?.data;
    },
    enabled: !!id && options?.enabled !== false, // ✅ Kết hợp cả 2
    ...options, // Spread các options khác
  });
};
export const useCreateItem = (
  key: QueryKey,
  api: CrudService,
  successMsg = 'Thành công!',
  errorMsg = 'Thất bại!',
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.createOne!(data),
    onSuccess: () => {
      message.success(successMsg);
      queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (error: any) => {
      console.error('Error creating item:', error);
      message.error(error?.response?.data?.message ?? errorMsg);
    },
  });
};

export const useUpdateItem = (
  key: QueryKey,
  api: CrudService,
  successMsg = 'Cập nhật thành công!',
  errorMsg = 'Cập nhật thất bại!',
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id?: string; data: any }) =>
      api.updateOne!(data?.id ?? '', data.data),
    onSuccess: () => {
      message.success(successMsg);
      queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message ?? errorMsg);
    },
  });
};

export const useDeleteItem = (
  key: QueryKey,
  api: CrudService,
  successMsg = 'Xóa thành công!',
  errorMsg = 'Xóa thất bại!',
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteOne!(id),
    onSuccess: () => {
      message.success(successMsg);
      queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message ?? errorMsg);
    },
  });
};
