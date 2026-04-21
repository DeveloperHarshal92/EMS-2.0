// src/features/tasks/components/TaskItem.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTasks } from "../hooks/useTasks";

// ── Status cycle: clicking advances through states ────────────────────────────
const STATUS_CYCLE = {
  new:    "active",
  active: "done",
  done:   "done",   // terminal — only admin can reset
  failed: "failed", // terminal
};

const STATUS_LABELS = {
  new:    "New",
  active: "Active",
  done:   "Done",
  failed: "Failed",
};

// ── Chevron icon (inline, no external dep) ────────────────────────────────────
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Spinner for optimistic patch ──────────────────────────────────────────────
const Spinner = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    style={{ animation: "task-spin 0.7s linear infinite", width: 12, height: 12 }}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

/**
 * TaskItem
 *
 * Props:
 *   task    — { _id, title, category, assigneeName, dueDate, status }
 *   animate — boolean (wrap in motion.div for staggered list entry)
 *   index   — number (used for stagger delay)
 *   readOnly — boolean (disable status cycling, e.g. for employee view of admin tasks)
 */
const TaskItem = ({ task, animate = true, index = 0, readOnly = false }) => {
  const { changeTaskStatus } = useTasks();
  const [localStatus, setLocalStatus]   = useState(task.status);
  const [patching,    setPatching]      = useState(false);

  const isTerminal = localStatus === "done" || localStatus === "failed";

  const handleStatusClick = async (e) => {
    e.stopPropagation();
    if (readOnly || isTerminal || patching) return;

    const next = STATUS_CYCLE[localStatus];
    if (next === localStatus) return;

    // Optimistic update
    setLocalStatus(next);
    setPatching(true);

    try {
      await changeTaskStatus(task._id, next);
    } catch {
      // Roll back on network failure
      setLocalStatus(localStatus);
    } finally {
      setPatching(false);
    }
  };

  const row = (
    <div className="task-row" style={{ cursor: readOnly ? "default" : "pointer" }}>
      {/* Status dot — clickable */}
      <button
        className={`task-row__dot task-row__dot--${localStatus}`}
        onClick={handleStatusClick}
        disabled={readOnly || isTerminal || patching}
        aria-label={`Status: ${localStatus}${!readOnly && !isTerminal ? " — click to advance" : ""}`}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: readOnly || isTerminal ? "default" : "pointer",
          width: 8,
          height: 8,
          borderRadius: "50%",
          flexShrink: 0,
          // colour is applied by the SCSS class, but we keep the element shape
        }}
      />

      {/* Info */}
      <div className="task-row__info">
        <div
          className="task-row__title"
          style={{
            textDecoration: localStatus === "done" ? "line-through" : "none",
            opacity:        localStatus === "done" ? 0.45 : 1,
            transition: "opacity 0.2s ease, text-decoration 0.2s ease",
          }}
        >
          {task.title}
        </div>
        <div className="task-row__meta">
          {task.assigneeName || "Unassigned"} &middot; {task.category}
          {task.dueDate && <> &middot; Due {task.dueDate}</>}
        </div>
      </div>

      {/* Badge */}
      <span className={`task-row__badge task-row__badge--${localStatus}`}>
        {patching ? <Spinner /> : STATUS_LABELS[localStatus]}
      </span>

      {/* Action chevron */}
      {!readOnly && (
        <button
          className="task-row__action"
          onClick={handleStatusClick}
          aria-label="Advance status"
          disabled={isTerminal || patching}
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );

  if (!animate) return row;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.055, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {row}
    </motion.div>
  );
};

export default TaskItem;