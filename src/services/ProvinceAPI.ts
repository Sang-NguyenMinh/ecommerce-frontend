import axios from 'axios';

// @/services/provinceApi.ts (hoặc @/lib/provinceApi.ts)
const PROVINCE_API = 'https://open.oapi.vn/location';

export const provinceApi = {
  getProvinces: async () => {
    const res = await axios.get(`${PROVINCE_API}/provinces?page=0&size=100`);
    return res.data;
  },

  getDistricts: async (provinceId: string) => {
    const res = await axios.get(
      `${PROVINCE_API}/districts/${provinceId}?page=0&size=100`,
    );
    return res.data;
  },

  getWards: async (districtId: string) => {
    const res = await axios.get(
      `${PROVINCE_API}/wards/${districtId}?page=0&size=100`,
    );
    return res.data;
  },
};
