import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:9696",
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (location.pathname !== "/login" && error.response.status === 401) {
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
