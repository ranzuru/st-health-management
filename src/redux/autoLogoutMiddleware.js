import { REMOVE_USER, SHOW_IDLE_DIALOG } from "./actions/authActions";

let idleTimer = null;
const idleTime = 10 * 1000; // 10 seconds

const autoLogoutMiddleware = (store) => (next) => (action) => {
  resetTimer(store.dispatch);
  return next(action);
};

const resetTimer = (dispatch) => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    dispatch({ type: SHOW_IDLE_DIALOG });
    // Now, after showing the dialog, you can set another timer to log out the user
    setTimeout(() => {
      dispatch({ type: REMOVE_USER });
    }, 5000); // e.g., log out 5 seconds after showing the dialog
  }, idleTime);
};

export default autoLogoutMiddleware;
