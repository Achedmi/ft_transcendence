import axios from 'axios';
import { toast } from 'react-toastify';
import { Error } from '../components/icons/icons';

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
    } else if (error.response?.status === 403 && location.pathname !== '/tfa' && location.pathname !== '/setup') {
      if (!error.response?.data.isSetupCompleted) window.location.href = '/setup';
      else window.location.href = '/tfa';
    } else if (error.response?.status !== 403 && error.response.status !== 401)
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Something went wrong', {
        className: 'toast-error',
        icon: Error,
        progressClassName: 'Toastify__progress-bar-error',
      });
    return Promise.reject(error);
  },
);

export default axiosInstance;
