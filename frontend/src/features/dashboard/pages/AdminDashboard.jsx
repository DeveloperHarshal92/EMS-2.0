// src/features/dashboard/pages/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar  from "../components/Sidebar";
import TopBar   from "../components/TopBar";
import TaskItem from "../../tasks/components/TaskItem";
import { useTasks } from "../../tasks/hooks/useTasks";
import "../dashboard.scss";

// ─── Icons ────────────────────────────────────────────────────────────────────
const I = {
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Tasks: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
  Leave: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="3"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
    </svg>
  ),
  Health: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  UserPlus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  ),
  ClipAdd: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1"/>
      <line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
    </svg>
  ),
  Report: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
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
  TrendDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  AlignLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="21" y1="10" x2="3" y2="10"/>
      <line x1="21" y1="6"  x2="3" y2="6"/>
      <line x1="21" y1="14" x2="3" y2="14"/>
      <line x1="21" y1="18" x2="9" y2="18"/>
    </svg>
  ),
};

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUpStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const modalOverlay = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.2 } },
  exit:   { opacity: 0, transition: { duration: 0.18 } },
};
const modalCard = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.2 } },
};

// ─── Static mock data ─────────────────────────────────────────────────────────
const EMPLOYEES_MOCK = [
  { _id: "e1", fname: "Aarav Sharma",  role: "Engineer"  },
  { _id: "e2", fname: "Riya Verma",    role: "Designer"  },
  { _id: "e3", fname: "Kabir Mehta",   role: "QA"        },
  { _id: "e4", fname: "Neha Kulkarni", role: "DevOps"    },
  { _id: "e5", fname: "Arjun Singh",   role: "Marketing" },
];

const TEAM_STATS = [
  { name: "Aarav Sharma",  role: "Engineer",  tasks: 4, done: 3, status: "active"  },
  { name: "Riya Verma",    role: "Designer",  tasks: 6, done: 4, status: "active"  },
  { name: "Kabir Mehta",   role: "QA",        tasks: 3, done: 1, status: "leave"   },
  { name: "Neha Kulkarni", role: "DevOps",    tasks: 5, done: 5, status: "active"  },
  { name: "Arjun Singh",   role: "Marketing", tasks: 7, done: 2, status: "offline" },
];

const WEEK_ACTIVITY = [42, 68, 55, 80, 63, 90, 74];
const DAYS          = ["M", "T", "W", "T", "F", "S", "S"];
const CATEGORIES    = ["Dev", "Design", "QA", "DevOps", "Marketing", "Reporting", "Comms", "Docs"];

// ─── Assign Task Modal ────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title:       "",
  description: "",   // ← NEW required field matching tasks.model.js
  category:    "",
  assigneeId:  "",
  dueDate:     "",
};

const AssignTaskModal = ({ onClose }) => {
  const { createNewTask, loading, error, dismissError } = useTasks();
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [fieldErrs, setFieldErrs] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const titleRef = useRef(null);

  // Focus first field on mount
  useEffect(() => { titleRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim())
      errs.title = "Task title is required";
    // ← NEW: description validation mirrors backend (required, min 10 chars)
    if (!form.description.trim())
      errs.description = "Description is required";
    else if (form.description.trim().length < 10)
      errs.description = "Description must be at least 10 characters";
    if (!form.category)
      errs.category = "Select a category";
    if (!form.assigneeId)
      errs.assigneeId = "Select an assignee";
    if (!form.dueDate)
      errs.dueDate = "Due date is required";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrs[e.target.name]) {
      setFieldErrs({ ...fieldErrs, [e.target.name]: "" });
    }
    if (error) dismissError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrs(errs); return; }

    const assignee = EMPLOYEES_MOCK.find((em) => em._id === form.assigneeId);
    const task = await createNewTask({
      title:        form.title.trim(),
      description:  form.description.trim(),   // ← passed to API
      category:     form.category,
      assignedTo:   form.assigneeId,           // backend expects assignedTo (_id)
      date:         form.dueDate,              // backend field is `date`
      assigneeName: assignee?.fname ?? "Unknown",
    });

    if (task) {
      setSubmitted(true);
      setTimeout(onClose, 1200);
    }
  };

  return (
    <div className="modal__body">
      {/* Header */}
      <div className="modal__head">
        <div>
          <div className="modal__title">Assign New Task</div>
          <div className="modal__sub">Delegate work to a team member</div>
        </div>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <I.X />
        </button>
      </div>

      {/* Global API error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="modal__alert modal__alert--error"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <I.Alert /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success state */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="modal__alert modal__alert--success"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          >
            <I.Check /> Task created — closing…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      {!submitted && (
        <form className="modal__form" onSubmit={handleSubmit} noValidate>

          {/* Title */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="task-title">Task title</label>
            <input
              id="task-title"
              ref={titleRef}
              name="title"
              className={`modal__input${fieldErrs.title ? " modal__input--error" : ""}`}
              type="text"
              placeholder="e.g. Migrate auth module to JWT"
              value={form.title}
              onChange={handleChange}
              autoComplete="off"
            />
            {fieldErrs.title && (
              <span className="modal__err"><I.Alert />{fieldErrs.title}</span>
            )}
          </div>

          {/* ── Description (NEW) ── */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="task-desc">
              Description
            </label>
            <div className="modal__textarea-wrap">
              {/* icon aligned to top of textarea */}
              <span className="modal__textarea-icon">
                <I.AlignLeft />
              </span>
              <textarea
                id="task-desc"
                name="description"
                className={`modal__textarea${fieldErrs.description ? " modal__input--error" : ""}`}
                placeholder="Describe the task, expected outcome, and any key constraints…"
                value={form.description}
                onChange={handleChange}
                maxLength={800}
                rows={3}
              />
            </div>
            <div className="modal__field-footer">
              {fieldErrs.description
                ? <span className="modal__err"><I.Alert />{fieldErrs.description}</span>
                : <span />
              }
              <span className="modal__char-count">
                {form.description.length}/800
              </span>
            </div>
          </div>

          {/* Category + Assignee row */}
          <div className="modal__row">
            <div className="modal__field">
              <label className="modal__label" htmlFor="task-cat">Category</label>
              <select
                id="task-cat"
                name="category"
                className={`modal__select${fieldErrs.category ? " modal__input--error" : ""}`}
                value={form.category}
                onChange={handleChange}
              >
                <option value="" disabled>Select…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {fieldErrs.category && (
                <span className="modal__err"><I.Alert />{fieldErrs.category}</span>
              )}
            </div>

            <div className="modal__field">
              <label className="modal__label" htmlFor="task-assignee">Assignee</label>
              <select
                id="task-assignee"
                name="assigneeId"
                className={`modal__select${fieldErrs.assigneeId ? " modal__input--error" : ""}`}
                value={form.assigneeId}
                onChange={handleChange}
              >
                <option value="" disabled>Select…</option>
                {EMPLOYEES_MOCK.map((em) => (
                  <option key={em._id} value={em._id}>{em.fname}</option>
                ))}
              </select>
              {fieldErrs.assigneeId && (
                <span className="modal__err"><I.Alert />{fieldErrs.assigneeId}</span>
              )}
            </div>
          </div>

          {/* Due date */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="task-due">Due date</label>
            <input
              id="task-due"
              name="dueDate"
              className={`modal__input${fieldErrs.dueDate ? " modal__input--error" : ""}`}
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
            {fieldErrs.dueDate && (
              <span className="modal__err"><I.Alert />{fieldErrs.dueDate}</span>
            )}
          </div>

          {/* Actions */}
          <div className="modal__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary btn--sm" disabled={loading}>
              {loading && <span className="btn__spinner" aria-hidden="true" />}
              {loading ? "Creating…" : "Create task"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ─── Generate Report Modal ────────────────────────────────────────────────────
const ReportModal = ({ onClose }) => {
  const { tasks, openCount, doneCount } = useTasks();
  const total     = tasks.length;
  const failCount = tasks.filter((t) => t.status === "failed").length;

  const handleExport = () => {
    const rows = [
      ["Title", "Description", "Assignee", "Category", "Due Date", "Status"],
      ...tasks.map((t) => [
        t.title,
        // wrap description in quotes to handle commas inside the text
        `"${(t.description || "").replace(/"/g, '""')}"`,
        t.assigneeName,
        t.category,
        t.dueDate,
        t.status,
      ]),
    ];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `ems-task-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal__body">
      <div className="modal__head">
        <div>
          <div className="modal__title">Generate Report</div>
          <div className="modal__sub">Export task analytics as CSV</div>
        </div>
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <I.X />
        </button>
      </div>

      <div className="report-grid">
        {[
          { label: "Total tasks", value: total,      color: "var(--accent)"        },
          { label: "Open",        value: openCount,  color: "var(--status-active)" },
          { label: "Completed",   value: doneCount,  color: "var(--status-done)"   },
          { label: "Failed",      value: failCount,  color: "var(--status-failed)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="report-grid__cell" style={{ "--cell-color": color }}>
            <div className="report-grid__value" style={{ color }}>{value}</div>
            <div className="report-grid__label">{label}</div>
          </div>
        ))}
      </div>

      <div className="modal__actions" style={{ marginTop: "1.5rem" }}>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={handleExport}
          disabled={total === 0}
        >
          <I.Download /> Export CSV
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [modal,     setModal]     = useState(null); // "assign" | "report" | null
  const user     = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const { tasks, loading: tasksLoading, error: tasksError, loadTasks, openCount } = useTasks();

  // Load tasks on mount
  useEffect(() => { loadTasks(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const maxBar = Math.max(...WEEK_ACTIVITY);

  // ── Stat cards ──────────────────────────────────────────────────────────────
  const STATS = [
    {
      label: "Total Workforce",
      value: String(TEAM_STATS.length),
      delta: "+2 this month",
      trend: "up",
      icon:  I.Users,
      accent: "#00d4ff",
    },
    {
      label: "Open Tasks",
      value: tasksLoading ? "…" : String(openCount || WEEK_ACTIVITY.length),
      delta: "12 overdue",
      trend: "down",
      icon:  I.Tasks,
      accent: "#f59e0b",
    },
    {
      label: "Leave Requests",
      value: "5",
      delta: "Pending review",
      trend: "neutral",
      icon:  I.Leave,
      accent: "#7c3aed",
    },
    {
      label: "System Health",
      value: "99%",
      delta: "All services up",
      trend: "up",
      icon:  I.Health,
      accent: "#10b981",
    },
  ];

  // ── Quick actions ────────────────────────────────────────────────────────────
  const QUICK_ACTIONS = [
    {
      icon:   I.ClipAdd,
      text:   "Assign New Task",
      sub:    "Delegate work to an employee",
      action: () => setModal("assign"),
    },
    {
      icon:   I.Users,
      text:   "Team Overview",
      sub:    "Browse employee directory",
      action: () => navigate("/admin/employees"),
    },
    {
      icon:   I.Report,
      text:   "Generate Report",
      sub:    "Export task analytics as CSV",
      action: () => setModal("report"),
    },
    {
      icon:   I.UserPlus,
      text:   "Add Employee",
      sub:    "Onboard a new team member",
      // ← Fixed: navigates to /register (admin-protected), not /admin/employees
      action: () => navigate("/register"),
    },
  ];

  return (
    <>
      <div className="ds">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} role="admin" />

        <div className="ds__main">
          <TopBar
            title="Dashboard"
            subtitle={new Date().toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric",
            })}
          />

          <div className="ds__content">
            {/* ── Page header ───────────────────────────────────────────── */}
            <motion.div
              className="page-header"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="page-header__eyebrow">Admin View</p>
              <h1 className="page-header__title">
                Good morning, {user?.fname?.split(" ")[0] || "Admin"}
              </h1>
              <p className="page-header__meta">
                Here's what's happening across your organisation today.
              </p>
            </motion.div>

            {/* ── Stat cards ────────────────────────────────────────────── */}
            <motion.div
              className="stats-grid"
              variants={fadeUpStagger}
              initial="hidden"
              animate="show"
            >
              {STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    className="stat-card"
                    variants={fadeUpItem}
                    style={{ "--stat-accent": s.accent }}
                  >
                    <div className="stat-card__delta" style={{
                      color: s.trend === "up"   ? "var(--success)"
                           : s.trend === "down" ? "var(--error)"
                           : "var(--text-muted)",
                    }}>
                      {s.trend === "up"   && <I.TrendUp />}
                      {s.trend === "down" && <I.TrendDown />}
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

            {/* ── Main 2-column grid ────────────────────────────────────── */}
            <motion.div
              className="content-grid content-grid--3col"
              variants={fadeUpStagger}
              initial="hidden"
              animate="show"
              style={{ marginBottom: "1.25rem" }}
            >
              {/* Team overview table */}
              <motion.div className="panel" variants={fadeUpItem}>
                <div className="panel__head">
                  <div>
                    <div className="panel__title">Team Overview</div>
                    <div className="panel__subtitle">Task completion per employee</div>
                  </div>
                  <button
                    className="panel__action"
                    onClick={() => navigate("/admin/employees")}
                  >
                    View all
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="emp-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Role</th>
                        <th>Progress</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TEAM_STATS.map((e, i) => {
                        const pct = Math.round((e.done / e.tasks) * 100);
                        const statusColor =
                          e.status === "active"  ? "var(--success)"
                        : e.status === "leave"   ? "var(--status-active)"
                        : "var(--text-muted)";
                        return (
                          <tr key={i}>
                            <td>
                              <span className="emp-table__avatar">
                                {e.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </span>
                              <span className="emp-table__name">{e.name}</span>
                            </td>
                            <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                              {e.role}
                            </td>
                            <td style={{ minWidth: 120 }}>
                              <div style={{
                                marginBottom: 4, fontSize: "0.73rem",
                                color: "var(--text-secondary)",
                                display: "flex", justifyContent: "space-between",
                              }}>
                                <span>{e.done}/{e.tasks}</span>
                                <span style={{ color: "var(--accent)" }}>{pct}%</span>
                              </div>
                              <div className="progress">
                                <div className="progress__fill" style={{ width: `${pct}%` }} />
                              </div>
                            </td>
                            <td>
                              <span style={{
                                fontSize: "0.68rem", fontWeight: 600,
                                color: statusColor,
                                background: `color-mix(in srgb, ${statusColor} 15%, transparent)`,
                                padding: "0.18rem 0.55rem",
                                borderRadius: 20, textTransform: "capitalize",
                              }}>
                                {e.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Right column: Weekly Activity + Quick Actions */}
              <motion.div
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                variants={fadeUpItem}
              >
                {/* Weekly activity bar chart */}
                <div className="panel">
                  <div className="panel__head">
                    <div>
                      <div className="panel__title">Weekly Activity</div>
                      <div className="panel__subtitle">Task completion rate</div>
                    </div>
                  </div>
                  <div className="panel__body">
                    <div className="bar-chart">
                      {WEEK_ACTIVITY.map((v, i) => (
                        <div
                          key={i}
                          className={`bar-chart__bar${
                            i === new Date().getDay() - 1 ? " bar-chart__bar--highlight" : ""
                          }`}
                          style={{ height: `${(v / maxBar) * 100}%` }}
                          data-tooltip={`${v}%`}
                        />
                      ))}
                    </div>
                    <div className="bar-labels">
                      {DAYS.map((d, i) => <span key={i}>{d}</span>)}
                    </div>
                  </div>
                </div>

                {/* Quick Actions panel */}
                <div className="panel">
                  <div className="panel__head">
                    <div>
                      <div className="panel__title">Quick Actions</div>
                      <div className="panel__subtitle">Common admin operations</div>
                    </div>
                  </div>
                  <div className="panel__body" style={{ padding: "0.85rem 1rem" }}>
                    <div className="qa-list">
                      {QUICK_ACTIONS.map((a, i) => {
                        const Icon = a.icon;
                        return (
                          <motion.div
                            key={i}
                            className="qa-list__item"
                            role="button"
                            tabIndex={0}
                            onClick={a.action}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                a.action();
                              }
                            }}
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.15 }}
                          >
                            <div className="qa-list__icon"><Icon /></div>
                            <div style={{ flex: 1 }}>
                              <div className="qa-list__text">{a.text}</div>
                              <div className="qa-list__sub">{a.sub}</div>
                            </div>
                            <span className="qa-list__arrow"><I.ChevronRight /></span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Recent Tasks panel ─────────────────────────────────────── */}
            <motion.div
              className="panel"
              variants={fadeUpItem}
              initial="hidden"
              animate="show"
            >
              <div className="panel__head">
                <div>
                  <div className="panel__title">Recent Tasks</div>
                  <div className="panel__subtitle">
                    {tasksLoading
                      ? "Loading…"
                      : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} across all employees`}
                  </div>
                </div>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setModal("assign")}
                >
                  <I.Plus /> Assign Task
                </button>
              </div>

              {/* Tasks error banner */}
              <AnimatePresence>
                {tasksError && (
                  <motion.div
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.65rem 1.5rem",
                      background: "rgba(248,113,113,0.08)",
                      borderBottom: "1px solid rgba(248,113,113,0.18)",
                      color: "var(--error)", fontSize: "0.8rem",
                    }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <I.Alert /> {tasksError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Task list */}
              <div className="task-list">
                {tasksLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="task-row" style={{ gap: "1rem" }}>
                      <div className="skeleton" style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0 }} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <div className="skeleton" style={{ height: 13, width: "60%", borderRadius: 4 }} />
                        <div className="skeleton" style={{ height: 11, width: "35%", borderRadius: 4 }} />
                      </div>
                      <div className="skeleton" style={{ width: 52, height: 20, borderRadius: 12 }} />
                    </div>
                  ))
                ) : tasks.length > 0 ? (
                  tasks.map((task, i) => (
                    <TaskItem key={task._id} task={task} index={i} animate />
                  ))
                ) : (
                  <div className="panel__empty" style={{ padding: "2.5rem 1.5rem" }}>
                    <div style={{ marginBottom: "0.5rem", opacity: 0.4, fontSize: "1.75rem" }}>
                      <I.Tasks />
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                      No tasks yet
                    </div>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => setModal("assign")}
                    >
                      <I.Plus /> Assign the first task
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

          </div>{/* ds__content */}
        </div>{/* ds__main */}
      </div>{/* ds */}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="modal__overlay"
            variants={modalOverlay}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}
          >
            <motion.div variants={modalCard} className="modal__wrap">
              {modal === "assign" && (
                <AssignTaskModal onClose={() => setModal(null)} />
              )}
              {modal === "report" && (
                <ReportModal onClose={() => setModal(null)} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminDashboard;