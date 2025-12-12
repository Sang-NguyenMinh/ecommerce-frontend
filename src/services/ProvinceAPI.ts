import axios from 'axios';

// @/services/provinceApi.ts (hoặc @/lib/provinceApi.ts)
const PROVINCE_API = 'https://provinces.open-api.vn/api';

export const provinceApi = {
  getProvinces: async () => {
    const res = await axios.get(`${PROVINCE_API}/p/`);
    return res.data;
  },

  getDistricts: async (provinceCode: string) => {
    const res = await axios.get(`${PROVINCE_API}/p/${provinceCode}?depth=2`);
    return res.data.districts;
  },

  getWards: async (districtCode: string) => {
    const res = await axios.get(`${PROVINCE_API}/d/${districtCode}?depth=2`);
    return res.data.wards;
  },
};
