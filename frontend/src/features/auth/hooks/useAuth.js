import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setisLoading,
  setUser,
  logoutUser,
} from "../auth.slice";

import {
  loginUser,
  registerUser,
  getUser,
  logout,
} from "../service/auth.api";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  // reusable handler
  const asyncHandler = (fn) => async (...args) => {
    try {
      dispatch(setError(null));
      dispatch(setisLoading(true));
      return await fn(...args);
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "Something went wrong")
      );
    } finally {
      dispatch(setisLoading(false));
    }
  };

  const handleRegister = asyncHandler(async (data) => {
    await registerUser(data);
  });

  const handleLogin = asyncHandler(async (data) => {
    const res = await loginUser(data);
    dispatch(setUser(res.user));
  });

  const handleGetMe = asyncHandler(async () => {
    const res = await getUser();
    dispatch(setUser(res.user));
  });

  const handleLogout = asyncHandler(async () => {
    await logout();
    dispatch(logoutUser());
  });

  return {
    user,
    isLoading,
    error,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
}

