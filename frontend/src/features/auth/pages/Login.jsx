// src/features/auth/pages/Login.jsx
// Key change: after successful login, redirect based on user.role
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Login.scss";

const Icon = {
  Logo: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="3"/>
      <path d="M2 8l10 6 10-6"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="11" width="14" height="10" rx="3"/>
      <path d="M8 11V7a4 4 0 018 0v4"/>
    </svg>
  ),
  EyeOpen: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeClosed: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.94 10.94 0 0112 19C5 19 1 12 1 12a18.8 18.8 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">
      {dark ? <Icon.Sun /> : <Icon.Moon />}
    </button>
  );
}

const Login = () => {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [errors, setErrors]   = useState({});
  const emailRef              = useRef(null);
  const navigate              = useNavigate();
  const location              = useLocation();
  const { handleLogin, isLoading, error, user } = useAuth();

  useEffect(() => { emailRef.current?.focus(); }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user?.role) {
      const dest = user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard";
      navigate(dest, { replace: true });
    }
  }, [user]);

  const validate = () => {
    const e = {};
    if (!email)                           e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = "Enter a valid email";
    if (!password)                        e.password = "Password is required";
    else if (password.length < 3)         e.password = "Minimum 3 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await handleLogin({ email, password });

    // Navigate based on role returned from the login response
    if (res?.user?.role) {
      const dest = res.user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard";
      // Restore intended destination if coming from a protected route
      const from = location.state?.from?.pathname;
      navigate(from || dest, { replace: true });
    }
  };

  return (
    <>
      <ThemeToggle />
      <div className="auth-layout">
        <div className="auth-layout__grid" aria-hidden />
        <div className="auth-layout__orb auth-layout__orb--1" aria-hidden />
        <div className="auth-layout__orb auth-layout__orb--2" aria-hidden />
        <div className="auth-layout__orb auth-layout__orb--3" aria-hidden />

        <div className="auth-card" role="main">
          <div className="auth-card__brand">
            <div className="auth-card__logo"><Icon.Logo /></div>
            <span className="auth-card__brand-name">EMS <span>3.0</span></span>
          </div>

          <h1 className="auth-card__heading">Welcome back</h1>
          <p className="auth-card__subheading">Sign in to your workspace to continue</p>

          {error && (
            <div className="auth-alert auth-alert--error" role="alert">
              <Icon.AlertCircle />
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="field__label" htmlFor="login-email">Email</label>
              <div className="field__wrapper">
                <span className="field__icon"><Icon.Mail /></span>
                <input
                  id="login-email"
                  ref={emailRef}
                  className={`field__input${errors.email ? " field__input--error" : ""}`}
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: "" })); }}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="field__error"><Icon.AlertCircle /> {errors.email}</span>}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="login-password">Password</label>
              <div className="field__wrapper">
                <span className="field__icon"><Icon.Lock /></span>
                <input
                  id="login-password"
                  className={`field__input${errors.password ? " field__input--error" : ""}`}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: "" })); }}
                  autoComplete="current-password"
                />
                <button type="button" className="field__toggle-pw" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <Icon.EyeClosed /> : <Icon.EyeOpen />}
                </button>
              </div>
              {errors.password && <span className="field__error"><Icon.AlertCircle /> {errors.password}</span>}
            </div>

            <div className="auth-meta">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading && <span className="btn-primary__spinner" />}
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;