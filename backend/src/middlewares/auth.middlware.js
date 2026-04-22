import jwt from "jsonwebtoken";

export function authUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Invalid token",
    });
  }
}

export function authorizeRole(...roles) {
  return async (req, res, next) => {
    try {
      // req.user is populated by authUser above
      const user = await userModel.findById(req.user.id).select("role");

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          message: "Forbidden: insufficient permissions",
          success: false,
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        message: "Authorization check failed",
        success: false,
      });
    }
  };
}
