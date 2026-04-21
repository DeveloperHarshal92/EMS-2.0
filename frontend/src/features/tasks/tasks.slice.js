// src/features/tasks/tasks.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllTasks, createTask, updateTaskStatus } from "./services/tasks.api";

// ── Async Thunks ──────────────────────────────────────────────────────────────

/**
 * Fetch all tasks from the API.
 * Optionally pass { assigneeId } to filter by employee.
 */
export const fetchTasksThunk = createAsyncThunk(
  "tasks/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await fetchAllTasks(params);
      return data.tasks;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load tasks");
    }
  }
);

/**
 * Create a new task.
 * payload: { title, category, assigneeId, dueDate }
 */
export const createTaskThunk = createAsyncThunk(
  "tasks/create",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createTask(payload);
      return data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create task");
    }
  }
);

/**
 * Patch a task's status.
 * Pass { taskId, status } — status: "new" | "active" | "done" | "failed"
 */
export const updateTaskStatusThunk = createAsyncThunk(
  "tasks/updateStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const data = await updateTaskStatus(taskId, status);
      return data.task;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update task");
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const tasksSlice = createSlice({
  name: "tasks",

  initialState: {
    /** @type {Array<{_id:string, title:string, category:string, assigneeId:string, assigneeName:string, dueDate:string, status:"new"|"active"|"done"|"failed"}>} */
    items:   [],
    loading: false, // true during any async op
    error:   null,  // string | null
  },

  reducers: {
    // Optimistic local clear (e.g. on logout)
    clearTasks: (state) => {
      state.items = [];
      state.error = null;
    },
    // Clear only the error banner
    clearTaskError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchTasksThunk ───────────────────────────────────────────────────────
    builder
      .addCase(fetchTasksThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // ── createTaskThunk ───────────────────────────────────────────────────────
    builder
      .addCase(createTaskThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Prepend so the new task appears at the top of every list
        state.items.unshift(action.payload);
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // ── updateTaskStatusThunk ─────────────────────────────────────────────────
    builder
      .addCase(updateTaskStatusThunk.pending, (state) => {
        // Intentionally don't set global loading for a status patch —
        // the TaskItem handles its own optimistic visual.
        state.error = null;
      })
      .addCase(updateTaskStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex((t) => t._id === updated._id);
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(updateTaskStatusThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTasks, clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;