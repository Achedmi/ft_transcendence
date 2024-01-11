import axios from 'axios';

export const getQrCode = async () => {
  try {
    const response = await axios.get(`http://${import.meta.env.VITE_ADDRESS}:9696/auth/generateTFAQrCode`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
  }
};
