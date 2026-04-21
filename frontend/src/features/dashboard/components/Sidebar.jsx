// src/features/dashboard/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons ────────────────────────────────────────────────────────────────────
const I = {
  Logo: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Tasks: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Analytics: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  Report: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  MyTask: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// ─── Nav configs by role ──────────────────────────────────────────────────────
const ADMIN_NAV = [
  { section: "Overview" },
  { to: "/admin/dashboard",  icon: I.Dashboard, label: "Dashboard" },
  { to: "/admin/employees",  icon: I.Users,     label: "Employees", badge: null },
  { to: "/admin/tasks",      icon: I.Tasks,     label: "Tasks",    badge: "12" },
  { section: "Insights" },
  { to: "/admin/analytics",  icon: I.Analytics, label: "Analytics" },
  { to: "/admin/reports",    icon: I.Report,    label: "Reports" },
  { to: "/admin/calendar",   icon: I.Calendar,  label: "Calendar" },
  { section: "System" },
  { to: "/admin/settings",   icon: I.Settings,  label: "Settings" },
];

const EMP_NAV = [
  { section: "Workspace" },
  { to: "/employee/dashboard", icon: I.Dashboard, label: "Dashboard" },
  { to: "/employee/my-tasks",  icon: I.MyTask,    label: "My Tasks", badge: "3" },
  { to: "/employee/calendar",  icon: I.Calendar,  label: "Calendar" },
  { section: "Account" },
  { to: "/employee/settings",  icon: I.Settings,  label: "Settings" },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Sidebar = ({ collapsed, onToggle, role }) => {
  const { handleLogout, user } = useAuth();
  const navigate = useNavigate();
  const nav = role === "admin" ? ADMIN_NAV : EMP_NAV;

  const initials = user?.fname
    ? user.fname.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo"><I.Logo /></div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="sidebar__brand-name"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              EMS <span>3.0</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle */}
      <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
        <I.ChevronLeft />
      </button>

      {/* Nav */}
      <nav className="sidebar__nav">
        {nav.map((item, idx) => {
          if (item.section) {
            return (
              <div key={idx} className="sidebar__section-title">
                {item.section}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={idx}
              to={item.to}
              className={({ isActive }) =>
                `sidebar__nav-item${isActive ? " active" : ""}`
              }
              data-tooltip={collapsed ? item.label : undefined}
            >
              <span className="sidebar__nav-icon"><Icon /></span>
              {!collapsed && (
                <>
                  <span className="sidebar__label">{item.label}</span>
                  {item.badge && (
                    <span className="sidebar__badge">{item.badge}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer">
        {/* Profile */}
        <div
          className="sidebar__nav-item"
          style={{ pointerEvents: "none", opacity: 0.7 }}
        >
          <span
            style={{
              width: 17, height: 17, borderRadius: 6,
              background: "linear-gradient(135deg, var(--accent), #7c3aed)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.6rem", fontWeight: 700, color: "#fff", flexShrink: 0,
            }}
          >
            {initials}
          </span>
          {!collapsed && (
            <span className="sidebar__label" style={{ fontSize: "0.82rem" }}>
              {user?.fname || "User"}
            </span>
          )}
        </div>

        {/* Logout */}
        <div
          className="sidebar__nav-item"
          onClick={() => { handleLogout(); navigate("/login"); }}
          role="button"
          tabIndex={0}
          data-tooltip={collapsed ? "Logout" : undefined}
        >
          <span className="sidebar__nav-icon"><I.Logout /></span>
          {!collapsed && <span className="sidebar__label">Log out</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;