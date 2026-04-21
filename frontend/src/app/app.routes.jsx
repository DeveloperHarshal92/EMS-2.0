// src/app/app.routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";

// Auth pages
import Login    from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

// Route guard
import Protected from "../features/auth/components/Protected";

// Dashboard pages
import AdminDashboard    from "../features/dashboard/pages/AdminDashboard";
import EmployeeDashboard from "../features/dashboard/pages/EmployeeDashboard";

// Optional: stub placeholder for sub-routes not yet built
const ComingSoon = ({ label }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    height: "100vh", background: "var(--bg-base)",
    flexDirection: "column", gap: "0.75rem"
  }}>
    <span style={{
      fontFamily: "'Syne', sans-serif", fontSize: "1.5rem",
      fontWeight: 700, color: "var(--text-primary)"
    }}>
      {label}
    </span>
    <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
      Coming soon
    </span>
  </div>
);

export const router = createBrowserRouter([

  // ── Public ────────────────────────────────────────────────────────────────
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // ── Root redirect: navigate based on role (handled inside Login on submit) ─
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // ── Admin routes ──────────────────────────────────────────────────────────
  {
    path: "/admin",
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Protected role="admin">
            <AdminDashboard />
          </Protected>
        ),
      },
      {
        path: "employees",
        element: (
          <Protected role="admin">
            <ComingSoon label="Employees" />
          </Protected>
        ),
      },
      {
        path: "tasks",
        element: (
          <Protected role="admin">
            <ComingSoon label="Task Manager" />
          </Protected>
        ),
      },
      {
        path: "analytics",
        element: (
          <Protected role="admin">
            <ComingSoon label="Analytics" />
          </Protected>
        ),
      },
      {
        path: "reports",
        element: (
          <Protected role="admin">
            <ComingSoon label="Reports" />
          </Protected>
        ),
      },
      {
        path: "calendar",
        element: (
          <Protected role="admin">
            <ComingSoon label="Calendar" />
          </Protected>
        ),
      },
      {
        path: "settings",
        element: (
          <Protected role="admin">
            <ComingSoon label="Settings" />
          </Protected>
        ),
      },
    ],
  },

  // ── Employee routes ───────────────────────────────────────────────────────
  {
    path: "/employee",
    children: [
      {
        index: true,
        element: <Navigate to="/employee/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Protected role="employee">
            <EmployeeDashboard />
          </Protected>
        ),
      },
      {
        path: "my-tasks",
        element: (
          <Protected role="employee">
            <ComingSoon label="My Tasks" />
          </Protected>
        ),
      },
      {
        path: "calendar",
        element: (
          <Protected role="employee">
            <ComingSoon label="Calendar" />
          </Protected>
        ),
      },
      {
        path: "settings",
        element: (
          <Protected role="employee">
            <ComingSoon label="Settings" />
          </Protected>
        ),
      },
    ],
  },

  // ── Catch-all ─────────────────────────────────────────────────────────────
  {
    path: "*",
    element: (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "var(--bg-base)",
        flexDirection: "column", gap: "0.75rem"
      }}>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontSize: "4rem",
          fontWeight: 800, color: "var(--accent)"
        }}>404</span>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Page not found
        </span>
        <a href="/login" style={{ color: "var(--accent)", fontSize: "0.82rem", marginTop: 4 }}>
          Go back to login
        </a>
      </div>
    ),
  },
]);