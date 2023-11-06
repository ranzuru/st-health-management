const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  errorMessage: null,
  role: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      const { user, role } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
        role,
      };
    case "REMOVE_USER":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
      };
    case "LOGIN_ERROR":
      return { ...state, errorMessage: action.payload };

    case "RESET_LOGIN_ERROR":
      return { ...state, errorMessage: null };

    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };

    case "SET_REFRESH_TOKEN": // New case for refreshToken
      return {
        ...state,
        refreshToken: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
