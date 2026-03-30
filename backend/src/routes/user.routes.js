import { Router } from "express";
import { validateLogin } from "../validation/auth.validator.js";
import {
  registerUser,
  loginUser,
  getUserDetails,
  logoutUser,
} from "../controllers/users.controller.js";
import { authUser } from "../middlewares/auth.middlware.js";

const userRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
userRouter.post("/register", validateLogin, registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
userRouter.post("/login", validateLogin, loginUser);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Protected
 */
userRouter.get("/get-profile", authUser, getUserDetails);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Protected
 */
userRouter.post("/logout", logoutUser);

export default userRouter;
