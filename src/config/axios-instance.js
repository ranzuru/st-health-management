import axios from "axios";

// Function to retrieve the authentication token from storage
const getAuthToken = () => {
  // Replace this logic with your code to retrieve the token from cookies or local storage
  return localStorage.getItem("authToken"); // Example for local storage
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
    // Handle the successful response here
    return response;
  },
  (error) => {
    // Handle errors, including the 401 Unauthorized error
    console.error("Error fetching user settings:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
