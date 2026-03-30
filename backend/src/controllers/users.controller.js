import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// REGISTER
export async function registerUser(req, res) {
  try {
    const { fname, email, password , role } = req.body;

    if (!fname) {
      return res.status(400).json({
        message: "Name is required",
        success: false,
      });
    }

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fname,
      email,
      password: passwordHash,
      role: role || "employee",
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fname: user.fname,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
}

// LOGIN
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
}

// GET PROFILE
export async function getUserDetails(req, res) {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User details fetched successfully",
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
}

// LOGOUT 
export const logoutUser = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    message: "Logged out successfully",
    success: true,
  });
};