// src/features/dashboard/components/TaskForm.jsx
//
// Reusable task-creation form.
// Uses the same .modal__* CSS classes as AdminDashboard's AssignTaskModal
// so it looks identical whether rendered inline or inside a modal wrapper.
//
// Props:
//   employees  — Array<{ _id, fname }> — populate assignee list
//                Falls back to EMPLOYEES_MOCK when omitted (dev convenience)
//   onSuccess  — (task) => void — called after successful creation
//   onCancel   — () => void     — called on Cancel / close
//   showHeader — boolean (default true) — hide if parent already has a header

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTasks } from "../../tasks/hooks/useTasks";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Check: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlignLeft: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <line x1="21" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="9" y2="18" />
    </svg>
  ),
};

// ─── Dev fallback employees list ──────────────────────────────────────────────
const EMPLOYEES_MOCK = [
  { _id: "e1", fname: "Aarav Sharma" },
  { _id: "e2", fname: "Riya Verma" },
  { _id: "e3", fname: "Kabir Mehta" },
  { _id: "e4", fname: "Neha Kulkarni" },
  { _id: "e5", fname: "Arjun Singh" },
];

const CATEGORIES = [
  "Dev",
  "Design",
  "QA",
  "DevOps",
  "Marketing",
  "Reporting",
  "Comms",
  "Docs",
];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  assigneeId: "",
  dueDate: "",
};

// ─── Component ────────────────────────────────────────────────────────────────
const TaskForm = ({
  employees = EMPLOYEES_MOCK,
  onSuccess,
  onCancel,
  showHeader = true,
}) => {
  const { createNewTask, loading, error, dismissError } = useTasks();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrs, setFieldErrs] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // ── Validation — mirrors backend requirements exactly ──────────────────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Task title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    else if (form.description.trim().length < 10)
      errs.description = "Must be at least 10 characters";
    if (!form.category) errs.category = "Select a category";
    if (!form.assigneeId) errs.assigneeId = "Select an assignee";
    if (!form.dueDate) errs.dueDate = "Due date is required";
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
    if (Object.keys(errs).length) {
      setFieldErrs(errs);
      return;
    }

    const assignee = employees.find((em) => em._id === form.assigneeId);
    const task = await createNewTask({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      assignedTo: form.assigneeId, // backend field name
      date: form.dueDate, // backend field name
      assigneeName: assignee?.fname ?? "Unknown",
    });

    if (task) {
      setSubmitted(true);
      setTimeout(() => onSuccess?.(task), 1200);
    }
  };

  return (
    <div className="modal__body">
      {/* Header — optional */}
      {showHeader && (
        <div className="modal__head">
          <div>
            <div className="modal__title">Assign New Task</div>
            <div className="modal__sub">Delegate work to a team member</div>
          </div>
          {onCancel && (
            <button
              className="modal__close"
              onClick={onCancel}
              aria-label="Close"
            >
              <Ic.X />
            </button>
          )}
        </div>
      )}

      {/* Global API error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="modal__alert modal__alert--error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Ic.Alert /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="modal__alert modal__alert--success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Ic.Check /> Task created — closing…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      {!submitted && (
        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="tf-title">
              Task title
            </label>
            <input
              id="tf-title"
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
              <span className="modal__err">
                <Ic.Alert />
                {fieldErrs.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="tf-desc">
              Description
            </label>
            <div className="modal__textarea-wrap">
              <span className="modal__textarea-icon">
                <Ic.AlignLeft />
              </span>
              <textarea
                id="tf-desc"
                name="description"
                className={`modal__textarea${fieldErrs.description ? " modal__input--error" : ""}`}
                placeholder="Describe the task, expected outcome, and key constraints…"
                value={form.description}
                onChange={handleChange}
                maxLength={800}
                rows={3}
              />
            </div>
            <div className="modal__field-footer">
              {fieldErrs.description ? (
                <span className="modal__err">
                  <Ic.Alert />
                  {fieldErrs.description}
                </span>
              ) : (
                <span />
              )}
              <span className="modal__char-count">
                {form.description.length}/800
              </span>
            </div>
          </div>

          {/* Category + Assignee */}
          <div className="modal__row">
            <div className="modal__field">
              <label className="modal__label" htmlFor="tf-cat">
                Category
              </label>
              <select
                id="tf-cat"
                name="category"
                className={`modal__select${fieldErrs.category ? " modal__input--error" : ""}`}
                value={form.category}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select…
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {fieldErrs.category && (
                <span className="modal__err">
                  <Ic.Alert />
                  {fieldErrs.category}
                </span>
              )}
            </div>

            <div className="modal__field">
              <label className="modal__label" htmlFor="tf-assignee">
                Assignee
              </label>
              <select
                id="tf-assignee"
                name="assigneeId"
                className={`modal__select${fieldErrs.assigneeId ? " modal__input--error" : ""}`}
                value={form.assigneeId}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select…
                </option>
                {employees.map((em) => (
                  <option key={em._id} value={em._id}>
                    {em.fname}
                  </option>
                ))}
              </select>
              {fieldErrs.assigneeId && (
                <span className="modal__err">
                  <Ic.Alert />
                  {fieldErrs.assigneeId}
                </span>
              )}
            </div>
          </div>

          {/* Due date */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="tf-due">
              Due date
            </label>
            <input
              id="tf-due"
              name="dueDate"
              className={`modal__input${fieldErrs.dueDate ? " modal__input--error" : ""}`}
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
            {fieldErrs.dueDate && (
              <span className="modal__err">
                <Ic.Alert />
                {fieldErrs.dueDate}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="modal__actions">
            {onCancel && (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn--primary btn--sm"
              disabled={loading}
            >
              {loading && <span className="btn__spinner" aria-hidden="true" />}
              {loading ? "Creating…" : "Create task"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;
