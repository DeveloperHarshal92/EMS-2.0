// src/features/tasks/tasks.slice.js
import { createSlice } from "@reduxjs/toolkit";

/**
 * Normalises a raw task from the API into a consistent shape
 * for the UI layer.
 *
 * Backend stores status as four boolean flags:
 *   newTask | active | completed | failed
 * We collapse them into a single `status` string here so components
 * don't need to know about the boolean representation.
 */
export function normaliseTask(raw) {
  let status = "new";
  if (raw.active)    status = "active";
  if (raw.completed) status = "done";
  if (raw.failed)    status = "failed";
  if (raw.newTask && !raw.active && !raw.completed && !raw.failed) status = "new";

  return {
    _id:          raw._id,
    title:        raw.title        ?? "",
    description:  raw.description  ?? "",   // ← preserved from API
    category:     raw.category     ?? "",
    dueDate:      raw.date         ?? "",   // backend field is `date`
    assigneeName: raw.assigneeName ?? "",
    status,
  };
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items:     [],
    isLoading: false,
    error:     null,
  },
  reducers: {
    setTasks(state, action) {
      state.items = action.payload.map(normaliseTask);
    },
    addTask(state, action) {
      state.items.unshift(normaliseTask(action.payload));
    },
    updateTask(state, action) {
      const idx = state.items.findIndex((t) => t._id === action.payload._id);
      if (idx !== -1) state.items[idx] = normaliseTask(action.payload);
    },
    removeTask(state, action) {
      state.items = state.items.filter((t) => t._id !== action.payload);
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setLoading,
  setError,
  clearError,
} = tasksSlice.actions;

export default tasksSlice.reducer;