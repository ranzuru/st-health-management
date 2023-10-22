import axios from "axios";
import { removeUser, setToken } from "../redux/actions/authActions.js";
import store from "../redux/store.js";

// Function to retrieve the authentication token from storage
const getAuthToken = () => {
  return localStorage.getItem("authToken"); // Example for local storage
};

const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// Create an Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Adjust the base URL to match your API server
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios request interceptor to add the JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = getAuthToken();
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-new-access-token"];
    if (newToken) {
      store.dispatch(setToken(newToken));
      localStorage.setItem("authToken", newToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        store.dispatch(removeUser());
        return Promise.reject(error);
      }
      try {
        const res = await axios.post(
          "http://localhost:8080/auth/refresh-token",
          {
            refreshToken: refreshToken,
          }
        );
        const newToken = res.data.newToken;
        store.dispatch(setToken(newToken));
        localStorage.setItem("authToken", newToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(removeUser());
        localStorage.removeItem("refreshToken");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
