import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Login.scss";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const Login = () => {
  const { handleLogin, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    await handleLogin(form);
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  return (
    <div className="login">
      {/* Ambient orbs */}
      <span className="login__orb login__orb--1" aria-hidden="true" />
      <span className="login__orb login__orb--2" aria-hidden="true" />

      <div className="login__card" role="main">
        {/* Brand header */}
        <div className="login__brand">
          <span className="login__eyebrow">EMS 3.0</span>
          <h1 className="login__title">Welcome back</h1>
          <p className="login__subtitle">Sign in to your workspace</p>
        </div>

        {/* Global error */}
        {error && (
          <div className="login__alert login__alert--error" role="alert">
            <IconAlert />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="login__form" noValidate>
          {/* Email */}
          <div className="field">
            <label className="field__label" htmlFor="login-email">Email address</label>
            <div className="field__wrapper">
              <input
                id="login-email"
                className={`field__input${fieldErrors.email ? " field__input--error" : ""}`}
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <span className="field__icon"><IconMail /></span>
            </div>
            {fieldErrors.email && (
              <span className="field__error"><IconAlert />{fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="field">
            <label className="field__label" htmlFor="login-password">Password</label>
            <div className="field__wrapper">
              <input
                id="login-password"
                className={`field__input${fieldErrors.password ? " field__input--error" : ""}`}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <span className="field__icon"><IconLock /></span>
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="field__error"><IconAlert />{fieldErrors.password}</span>
            )}
          </div>

          {/* Forgot link */}
          <div className="login__actions">
            <Link to="/forgot-password" className="login__forgot">Forgot password?</Link>
          </div>

          {/* Submit */}
          <button type="submit" className="login__submit" disabled={isLoading}>
            {isLoading && <span className="spinner" aria-hidden="true" />}
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="login__footer">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;