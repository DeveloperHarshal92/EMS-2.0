// src/features/auth/components/Protected.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Protected — guards a route by auth state AND optional role.
 *
 * Usage:
 *   <Protected>              — auth only, any role
 *   <Protected role="admin"> — auth + must be admin
 *
 * Redirects:
 *   • Not logged in  → /login
 *   • Wrong role     → their own dashboard (cross-role block)
 */
const Protected = ({ children, role }) => {
  const user    = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.isloading);
  const location = useLocation();

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "var(--bg-base)",
        flexDirection: "column", gap: "1rem"
      }}>
        {/* Animated logo */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "pulse 1.2s ease-in-out infinite",
          boxShadow: "0 0 24px var(--accent-glow)"
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0b0e14" strokeWidth="2.2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.82rem", color: "var(--text-secondary)"
        }}>
          Authenticating…
        </span>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%       { transform: scale(0.92); opacity: 0.75; }
          }
        `}</style>
      </div>
    );
  }

  // ── Not authenticated ─────────────────────────────────────────────────────
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ── Cross-role guard ──────────────────────────────────────────────────────
  // If a required role is specified and the user doesn't have it,
  // send them to their correct dashboard instead of showing 403.
  if (role && user.role !== role) {
    const fallback =
      user.role === "admin"    ? "/admin/dashboard"
    : user.role === "employee" ? "/employee/dashboard"
    : "/login";

    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default Protected;