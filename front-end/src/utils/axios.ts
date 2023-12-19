import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `http://${import.meta.env.VITE_ADDRESS}:9696`,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && location.pathname !== '/login') {
      try {
        await axios.post(`http://${import.meta.env.VITE_ADDRESS}:9696/auth/refresh`, undefined, {
          withCredentials: true,
        });
        return axiosInstance.request(error.config);
      } catch (error) {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403 && location.pathname !== '/tfa') window.location.href = '/tfa';
    return Promise.reject(error);
  },
);

export default axiosInstance;
