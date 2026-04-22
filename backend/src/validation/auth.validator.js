// Shared email format check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates login payload: email + password only.
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  next();
};

/**
 * Validates registration payload: fname, email, password, role.
 * Used on the admin-only /register endpoint.
 */
export const validateRegister = (req, res, next) => {
  const { fname, email, password, role } = req.body;

  if (!fname || fname.trim().length < 2) {
    return res.status(400).json({
      message: "Full name must be at least 2 characters",
    });
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  const allowedRoles = ["admin", "employee"];
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  next();
};