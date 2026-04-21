// src/features/dashboard/pages/EmployeeDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import "../dashboard.scss";

// ─── Icons ────────────────────────────────────────────────────────────────────
const I = {
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="3"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Streak: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  Play: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <polygon fill="currentColor" points="10 8 16 12 10 16"/>
    </svg>
  ),
  Stop: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Award: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  Flag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  ),
};

// ─── Animation variants ───────────────────────────────────────────────────────
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const MY_TASKS = [
  { title: "Prepare monthly report",      cat: "Reporting",  status: "active",  date: "Jan 10" },
  { title: "Client follow-up call",        cat: "Comms",      status: "new",     date: "Jan 12" },
  { title: "Fix login timeout bug",        cat: "Dev",        status: "done",    date: "Jan 15" },
  { title: "Backend API optimization",     cat: "Dev",        status: "failed",  date: "Jan 17" },
  { title: "Update API documentation",     cat: "Docs",       status: "new",     date: "Jan 20" },
];

const DEADLINES = [
  { day: "22", month: "Jan", title: "Q4 Analytics Report",  cat: "Reporting", urgent: true  },
  { day: "25", month: "Jan", title: "Client Demo Deck",      cat: "Design",   urgent: false },
  { day: "28", month: "Jan", title: "Sprint retrospective",  cat: "Agile",    urgent: false },
];

const STATS = [
  { label: "Tasks Assigned",  value: "5",   delta: "+1 new",       trend: "up",      accent: "#00d4ff", icon: I.CheckCircle },
  { label: "Due This Week",   value: "2",   delta: "1 urgent",     trend: "down",    accent: "#f59e0b", icon: I.Flag        },
  { label: "Completed",       value: "3",   delta: "60% rate",     trend: "up",      accent: "#10b981", icon: I.Award       },
  { label: "Streak",          value: "7d",  delta: "Personal best",trend: "neutral", accent: "#7c3aed", icon: I.Streak      },
];

// ─── Clock Widget ─────────────────────────────────────────────────────────────
const ClockWidget = () => {
  const [clocked, setClocked] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (clocked) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [clocked]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  // Ring progress — max 9h work day = 32400s
  const MAX_SECS = 32400;
  const progress = Math.min(seconds / MAX_SECS, 1);
  const circumference = 2 * Math.PI * 40; // r=40
  const offset = circumference * (1 - progress);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric"
  });

  return (
    <div className="clock-widget">
      <div className={`clock-widget__status clock-widget__status--${clocked ? "in" : "out"}`}>
        {clocked ? "Session Active" : "Not Clocked In"}
      </div>
      <div className="clock-widget__date">{dateStr}</div>

      <div className="clock-widget__ring">
        <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
          <circle className="clock-widget__ring-track" cx="45" cy="45" r="40" />
          <circle
            className="clock-widget__ring-fill"
            cx="45" cy="45" r="40"
            strokeDashoffset={offset}
          />
        </svg>
        <div className="clock-widget__time">{fmt(seconds)}</div>
      </div>

      <button
        className={`clock-btn clock-btn--${clocked ? "out" : "in"}`}
        onClick={() => {
          if (clocked) setSeconds(0);
          setClocked(c => !c);
        }}
      >
        {clocked ? <I.Stop /> : <I.Play />}
        {clocked ? "Clock Out" : "Clock In"}
      </button>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const EmployeeDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [taskStates, setTaskStates] = useState(
    MY_TASKS.reduce((acc, t, i) => ({ ...acc, [i]: t.status }), {})
  );
  const user = useSelector(s => s.auth.user);

  const cycleStatus = (idx) => {
    const cycle = { new: "active", active: "done", done: "done", failed: "failed" };
    setTaskStates(prev => ({ ...prev, [idx]: cycle[prev[idx]] }));
  };

  return (
    <div className="ds">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        role="employee"
      />

      <div className="ds__main">
        <TopBar title="My Workspace" />

        <div className="ds__content">
          {/* Page header */}
          <motion.div
            className="page-header"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="page-header__eyebrow">Employee View</p>
            <h1 className="page-header__title">
              Hey, {user?.fname?.split(" ")[0] || "there"}
            </h1>
            <p className="page-header__meta">
              You have{" "}
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                {Object.values(taskStates).filter(s => s === "new" || s === "active").length} active tasks
              </span>{" "}
              today. Let's get things done.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="stats-grid"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  className="stat-card"
                  variants={fadeUp}
                  style={{ "--stat-accent": s.accent }}
                >
                  <div className="stat-card__delta" style={{
                    color: s.trend === "up" ? "var(--success)"
                         : s.trend === "down" ? "var(--error)"
                         : "var(--text-muted)"
                  }}>
                    {s.trend === "up" && <I.TrendUp />}
                    <span>{s.delta}</span>
                  </div>
                  <div className="stat-card__icon" style={{ background: `${s.accent}18` }}>
                    <Icon />
                  </div>
                  <div className="stat-card__value">{s.value}</div>
                  <div className="stat-card__label">{s.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main grid */}
          <motion.div
            className="content-grid content-grid--3col"
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{ marginBottom: "1.25rem" }}
          >
            {/* Task board */}
            <motion.div className="panel" variants={fadeUp}>
              <div className="panel__head">
                <div>
                  <div className="panel__title">My Task Board</div>
                  <div className="panel__subtitle">
                    Click a task to advance its status
                  </div>
                </div>
                <span style={{
                  fontSize: "0.72rem", fontWeight: 600, color: "var(--accent)",
                  background: "var(--accent-glow)", padding: "0.2rem 0.6rem",
                  borderRadius: 20
                }}>
                  {MY_TASKS.length} total
                </span>
              </div>
              <div className="task-list">
                {MY_TASKS.map((t, i) => {
                  const st = taskStates[i];
                  return (
                    <motion.div
                      key={i}
                      className="task-row"
                      onClick={() => cycleStatus(i)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.35 }}
                      title="Click to advance status"
                    >
                      <div className={`task-row__dot task-row__dot--${st}`} />
                      <div className="task-row__info">
                        <div
                          className="task-row__title"
                          style={{ textDecoration: st === "done" ? "line-through" : "none", opacity: st === "done" ? 0.5 : 1 }}
                        >
                          {t.title}
                        </div>
                        <div className="task-row__meta">
                          {t.cat} &middot; Due {t.date}
                        </div>
                      </div>
                      <span className={`task-row__badge task-row__badge--${st}`}>{st}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              variants={fadeUp}
            >
              {/* Clock In/Out */}
              <ClockWidget />

              {/* Upcoming deadlines */}
              <div className="panel">
                <div className="panel__head">
                  <div>
                    <div className="panel__title">Upcoming Deadlines</div>
                    <div className="panel__subtitle">Next 7 days</div>
                  </div>
                </div>
                <div className="deadline-list">
                  {DEADLINES.map((d, i) => (
                    <div key={i} className="deadline-list__item">
                      <div className="deadline-list__cal">
                        <div className="deadline-list__day">{d.day}</div>
                        <div className="deadline-list__month">{d.month}</div>
                      </div>
                      <div className="deadline-list__info">
                        <div className="deadline-list__title">{d.title}</div>
                        <div className="deadline-list__sub">{d.cat}</div>
                      </div>
                      {d.urgent && (
                        <span className="deadline-list__urgent">Urgent</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Attendance strip */}
          <motion.div
            className="panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="panel__head">
              <div>
                <div className="panel__title">Attendance — This Week</div>
                <div className="panel__subtitle">Your check-in history</div>
              </div>
            </div>
            <div className="panel__body">
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  { day: "Mon", h: "9:02",  out: "18:05", status: "on-time" },
                  { day: "Tue", h: "9:18",  out: "18:30", status: "late"    },
                  { day: "Wed", h: "8:55",  out: "17:50", status: "on-time" },
                  { day: "Thu", h: "9:01",  out: "18:15", status: "on-time" },
                  { day: "Fri", h: "—",     out: "—",     status: "absent"  },
                ].map((d, i) => {
                  const color =
                    d.status === "on-time" ? "var(--success)"
                  : d.status === "late"    ? "var(--status-active)"
                  : "var(--error)";
                  return (
                    <div key={i} style={{
                      flex: "1 1 80px", padding: "0.9rem",
                      background: "var(--row-bg)", borderRadius: 10,
                      border: "1px solid var(--border)", textAlign: "center",
                    }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
                        {d.day}
                      </div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Syne', sans-serif" }}>
                        {d.h}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginTop: 2 }}>
                        → {d.out}
                      </div>
                      <div style={{
                        fontSize: "0.62rem", fontWeight: 700, marginTop: 6,
                        color, textTransform: "capitalize"
                      }}>
                        {d.status.replace("-", " ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;