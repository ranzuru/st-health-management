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
  payload: { user, role: user.role },
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

export const initiateLogin = (email, password) => async (dispatch) => {
  try {
    const loginResponse = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    const { tempAuthToken, otpToken } = loginResponse.data;

    return { tempAuthToken, otpToken }; // Return these tokens to the component to use later
  } catch (error) {
    console.error("Error during initial login:", error);
    dispatch(
      loginError(
        error.response?.data.error ||
          "An unexpected error occurred during login."
      )
    );
  }
};

export const verifyOtp =
  (tempAuthToken, otpToken, otp, navigate) => async (dispatch) => {
    try {
      const verifyResponse = await axiosInstance.post("/auth/verify-otp", {
        tempAuthToken,
        otpToken,
        otp,
      });

      if (verifyResponse.data.token && verifyResponse.data.refreshToken) {
        const { token, refreshToken, user } = verifyResponse.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("refreshToken", refreshToken);

        dispatch(setUser(user));
        dispatch(setToken(token));
        dispatch(setRefreshToken(refreshToken));

        navigate("/app/dashboard"); // Proceed to navigate after successful OTP verification
      } else {
        dispatch(loginError("Invalid OTP. Please try again."));
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      dispatch(
        loginError(
          error.response?.data.error ||
            "An unexpected error occurred during OTP verification."
        )
      );
    }
  };

export const resendOtp = (tempAuthToken) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("/auth/resend-otp", {
      tempAuthToken,
    });
    const { otpToken } = response.data;
    return { otpToken };
  } catch (error) {
    console.error("Error during OTP resend:", error);
    dispatch(
      loginError(
        error.response?.data.error ||
          "An error occurred while resending the OTP."
      )
    );
    return {};
  }
};

// Grouped actions (if you need them grouped)
const actions = {
  setUser,
  setToken,
  setRefreshToken,
  removeUser,
  initiateLogin,
  verifyOtp,
  loginError,
  resendOtp,
  resetLoginError,
};

export default actions;
