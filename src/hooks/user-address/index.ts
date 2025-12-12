import { useQuery } from '@tanstack/react-query';
import { UserAddressAPI } from '@/services/UserAdressAPI';

const USER_ADDRESS_KEY = ['user-address'];

export const useUserAddress = () => {
  return useQuery({
    queryKey: [USER_ADDRESS_KEY],
    queryFn: async () => {
      const response = await UserAddressAPI.getUserAddresses();
      console.log('🔍 Type of response.data:', typeof response?.data);
      return response?.data;
    },
  });
};
