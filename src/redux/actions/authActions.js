import axiosInstance from "../../config/axios-instance";

// Action Types
export const SET_USER = "SET_USER";
export const SET_TOKEN = "SET_TOKEN";
export const SET_REFRESH_TOKEN = "SET_REFRESH_TOKEN";
export const REMOVE_USER = "REMOVE_USER";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const RESET_LOGIN_ERROR = "RESET_LOGIN_ERROR";

// Action Creators
export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

export const setRefreshToken = (refreshToken) => ({
  // New action creator
  type: SET_REFRESH_TOKEN,
  payload: refreshToken,
});

export const removeUser = () => ({
  type: REMOVE_USER,
});

export const loginError = (errorMessage) => ({
  type: LOGIN_ERROR,
  payload: errorMessage,
});

export const resetLoginError = () => ({
  type: RESET_LOGIN_ERROR,
});

export const loginUser = (email, password, navigate) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (response.data.token && response.data.refreshToken) {
        const { token, refreshToken } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("refreshToken", refreshToken);

        dispatch(setUser(response.data.user));
        dispatch(setToken(token));
        dispatch(setToken(refreshToken));
        navigate("/app/dashboard"); // Add this line
      } else {
        dispatch(loginError("Invalid credentials. Please try again."));
      }
    } catch (error) {
      console.error("Error during login:", error);

      if (error.response && error.response.status === 401) {
        const backendErrorMessage = error.response.data.error;
        dispatch(loginError(`Error during login: ${backendErrorMessage}`));
      } else {
        dispatch(loginError("An unexpected error occurred. Please try again."));
      }
    }
  };
};

// Grouped actions (if you need them grouped)
const actions = {
  setUser,
  setToken,
  setRefreshToken,
  removeUser,
  loginUser,
  loginError,
  resetLoginError,
};

export default actions;
