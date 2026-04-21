// src/features/dashboard/components/TopBar.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const TopBar = ({ title, subtitle, onMenuToggle }) => {
  const { user } = useAuth();
  const [dark, setDark] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  const initials = user?.fname
    ? user.fname.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const fmtTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit"
  });

  return (
    <header className="topbar">
      <div className="topbar__title">
        {title}
        {subtitle && (
          <span className="topbar__subtitle">— {subtitle}</span>
        )}
      </div>

      {/* Clock */}
      <span style={{
        fontSize: "0.78rem", color: "var(--text-muted)",
        fontFamily: "'Syne', sans-serif", fontWeight: 600, letterSpacing: "0.04em"
      }}>
        {fmtTime}
      </span>

      <div className="topbar__actions">
        {/* Search */}
        <button className="topbar__icon-btn" aria-label="Search">
          <SearchIcon />
        </button>

        {/* Notifications */}
        <button className="topbar__icon-btn topbar__icon-btn--dot" aria-label="Notifications">
          <BellIcon />
        </button>

        {/* Theme */}
        <button className="topbar__theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Avatar */}
        <div className="topbar__avatar" title={user?.fname}>
          {initials}
        </div>
      </div>
    </header>
  );
};

export default TopBar;