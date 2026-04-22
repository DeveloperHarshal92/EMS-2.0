// src/features/auth/pages/Register.jsx
// Admin-only employee registration. Redirects to /admin/dashboard on success.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Register.scss";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
  </svg>
);
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
const IconBriefcase = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
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
const IconCheck = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconChevron = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

// ─── PASSWORD STRENGTH ────────────────────────────────────────────────────────
const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: "", key: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map    = ["", "weak", "fair", "good", "strong"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score], key: map[score] };
};

const PasswordStrength = ({ password }) => {
  const { score, label, key } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div className="pw-strength">
      <div className="pw-strength__bars">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`pw-strength__bar${n <= score ? ` pw-strength__bar--${key}` : ""}`} />
        ))}
      </div>
      <span className={`pw-strength__label pw-strength__label--${key}`}>{label}</span>
    </div>
  );
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ROLES = [
  { value: "employee", label: "Employee" },
  { value: "admin",    label: "Admin"    },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const Register = () => {
  const { handleRegister, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]             = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed]         = useState(false);

  const [form, setForm] = useState({
    fname: "",
    email: "",
    role:  "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validateStep1 = () => {
    const errs = {};
    if (!form.fname.trim() || form.fname.trim().length < 2)
      errs.fname = "Full name must be at least 2 characters";
    if (!form.email)
      errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.role)
      errs.role = "Please select a role";
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.password)
      errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Minimum 6 characters";
    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords don't match";
    return errs;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setStep(2);
  };

  const handleBack = () => {
    setFieldErrors({});
    setStep(1);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    const { confirmPassword, ...payload } = form;
    const result = await handleRegister(payload);
    // On success, redirect Admin back to their dashboard
    if (result !== undefined || !error) {
      navigate("/admin/dashboard");
    }
  };

  const steps = [
    { n: 1, label: "Profile"  },
    { n: 2, label: "Security" },
  ];

  return (
    <div className="register">
      <span className="register__orb register__orb--1" aria-hidden="true" />
      <span className="register__orb register__orb--2" aria-hidden="true" />

      <div className="register__card">
        {/* ── Header ── */}
        <div className="register__brand">
          {/* Back to dashboard link for Admin context */}
          <button
            type="button"
            className="register__back-link"
            onClick={() => navigate("/admin/dashboard")}
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "0.35rem",
              background:     "none",
              border:         "none",
              cursor:         "pointer",
              color:          "var(--text-muted)",
              fontSize:       "0.78rem",
              fontWeight:     500,
              marginBottom:   "0.75rem",
              padding:        0,
            }}
          >
            <IconArrowLeft /> Back to Dashboard
          </button>

          <span className="register__eyebrow">EMS 3.0 — Admin</span>
          <h1 className="register__title">Register Employee</h1>
          <p className="register__subtitle">Create a new workspace account</p>
        </div>

        {/* ── Step indicator ── */}
        <div className="register__steps" role="list" aria-label="Registration steps">
          {steps.map((s, i) => (
            <div key={s.n} className="register__step" role="listitem">
              <div className={`register__step-dot${step === s.n ? " register__step-dot--active" : ""}${step > s.n ? " register__step-dot--done" : ""}`}>
                {step > s.n ? <IconCheck /> : s.n}
              </div>
              {i < steps.length - 1 && (
                <div className={`register__step-line${step > s.n ? " register__step-line--done" : ""}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Global error ── */}
        {error && (
          <div className="register__alert register__alert--error" role="alert">
            <IconAlert />
            {error}
          </div>
        )}

        {/* ── STEP 1: Profile ── */}
        {step === 1 && (
          <form onSubmit={handleNext} className="register__form" noValidate>
            <div className="register__panel">
              {/* Full name */}
              <div className="field">
                <label className="field__label" htmlFor="reg-fname">Full name</label>
                <div className="field__wrapper">
                  <input
                    id="reg-fname"
                    className={`field__input${fieldErrors.fname ? " field__input--error" : ""}`}
                    type="text" name="fname" placeholder="Alex Johnson"
                    value={form.fname} onChange={handleChange} autoComplete="name"
                  />
                  <span className="field__icon"><IconUser /></span>
                </div>
                {fieldErrors.fname && <span className="field__error"><IconAlert />{fieldErrors.fname}</span>}
              </div>

              {/* Email */}
              <div className="field">
                <label className="field__label" htmlFor="reg-email">Work email</label>
                <div className="field__wrapper">
                  <input
                    id="reg-email"
                    className={`field__input${fieldErrors.email ? " field__input--error" : ""}`}
                    type="email" name="email" placeholder="employee@company.com"
                    value={form.email} onChange={handleChange} autoComplete="email"
                  />
                  <span className="field__icon"><IconMail /></span>
                </div>
                {fieldErrors.email && <span className="field__error"><IconAlert />{fieldErrors.email}</span>}
              </div>

              {/* Role */}
              <div className="field">
                <label className="field__label" htmlFor="reg-role">Role</label>
                <div className="field__wrapper">
                  <select
                    id="reg-role"
                    className={`field__select${fieldErrors.role ? " field__input--error" : ""}`}
                    name="role" value={form.role} onChange={handleChange}
                  >
                    <option value="" disabled>Select role</option>
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <span className="field__icon"><IconBriefcase /></span>
                  <span className="field__chevron"><IconChevron /></span>
                </div>
                {fieldErrors.role && <span className="field__error"><IconAlert />{fieldErrors.role}</span>}
              </div>
            </div>

            <button type="submit" className="register__submit--full">Continue</button>
          </form>
        )}

        {/* ── STEP 2: Security ── */}
        {step === 2 && (
          <form onSubmit={submitHandler} className="register__form" noValidate>
            <div className="register__panel">
              {/* Password */}
              <div className="field">
                <label className="field__label" htmlFor="reg-password">Password</label>
                <div className="field__wrapper">
                  <input
                    id="reg-password"
                    className={`field__input${fieldErrors.password ? " field__input--error" : ""}`}
                    type={showPassword ? "text" : "password"}
                    name="password" placeholder="Create a strong password"
                    value={form.password} onChange={handleChange} autoComplete="new-password"
                  />
                  <span className="field__icon"><IconLock /></span>
                  <button type="button" className="field__toggle" onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
                {fieldErrors.password && <span className="field__error"><IconAlert />{fieldErrors.password}</span>}
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm password */}
              <div className="field">
                <label className="field__label" htmlFor="reg-confirm">Confirm password</label>
                <div className="field__wrapper">
                  <input
                    id="reg-confirm"
                    className={`field__input${fieldErrors.confirmPassword ? " field__input--error" : ""}`}
                    type="password" name="confirmPassword" placeholder="Re-enter your password"
                    value={form.confirmPassword} onChange={handleChange} autoComplete="new-password"
                  />
                  <span className="field__icon"><IconLock /></span>
                </div>
                {fieldErrors.confirmPassword && <span className="field__error"><IconAlert />{fieldErrors.confirmPassword}</span>}
              </div>

              {/* Note: Terms removed — Admin-initiated flow doesn't require employee consent here */}
            </div>

            <div className="register__nav">
              <button type="button" className="register__back" onClick={handleBack}>Back</button>
              <button type="submit" className="register__submit" disabled={isLoading}>
                {isLoading && <span className="spinner" aria-hidden="true" />}
                {isLoading ? "Creating…" : "Create account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;