import axios from "axios";
import qs from "qs";

const axiosInstance = axios.create({
    // baseURL: import.meta.env.PROD ? "" : "http://localhost:4000",
    baseURL: import.meta.env.VITE_SERVER_URL,

    withCredentials: true,
    paramsSerializer: (params) => {
        if (params.filters) {
            return qs.stringify({
                ...params,
                filters: JSON.stringify(params.filters),
            });
        }
        return qs.stringify(params);
    },
});

axiosInstance.interceptors.request.use(
    function (config) {
        if (!config.headers) {
            config.headers = {};
        }
        const token =
            localStorage.getItem("accessToken") ||
            localStorage.getItem("adminToken");
        const csrf = localStorage.getItem("csrfToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (csrf) {
            config.headers["x-xsrf-token"] = csrf;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const setCsrfToken = async () => {
    try {
        const res = await axiosInstance.get("/csrf-token");
        const token = res.data.csrfToken;
        localStorage.setItem("csrfToken", token);
        axiosInstance.defaults.headers.common["x-xsrf-token"] = token;
        document.cookie = `XSRF-TOKEN=${token}; path=/;`;
    } catch (err) {
        console.error("CSRF 토큰 요청 실패:", err);
    }
};

export default axiosInstance;
