import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:9696",
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401 && location.pathname !== "/login")
			window.location.href = "/login";
		else if (error.response?.status === 403 && location.pathname !== "/tfa")
			window.location.href = "/tfa";
		return Promise.reject(error);
	}
);

export default axiosInstance;
