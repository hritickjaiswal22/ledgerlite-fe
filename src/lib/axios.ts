import { create } from "axios";

const axiosInstance = create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 10000, // 10 seconds
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------------------------------------------------
// Request Interceptor
// ----------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    // You can attach authentication tokens here
    // const token = getCookie('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ----------------------------------------------------------------
// Response Interceptor
// ----------------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx triggers this function
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      // Handle global errors, like redirecting on 401 Unauthorized
      if (error.response.status === 401) {
        console.error("Unauthorized access - perhaps redirect to login?");
        // Example: window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
