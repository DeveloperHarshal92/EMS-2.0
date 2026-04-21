// src/features/tasks/hooks/useTasks.js
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasksThunk,
  createTaskThunk,
  updateTaskStatusThunk,
  clearTaskError,
} from "../tasks.slice";

/**
 * useTasks — encapsulates every task-related dispatch call.
 *
 * Mirrors the useAuth pattern exactly:
 *   - Reads state via useSelector
 *   - Wraps each thunk in an asyncHandler for uniform error handling
 *   - Returns stable function references and derived selectors
 */
export function useTasks() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.tasks);

  // ── Derived selectors ────────────────────────────────────────────────────
  const tasksByStatus = (status) => items.filter((t) => t.status === status);
  const openCount     = items.filter((t) => t.status === "new" || t.status === "active").length;
  const doneCount     = items.filter((t) => t.status === "done").length;

  // ── Action creators ──────────────────────────────────────────────────────

  /**
   * Load all tasks. Pass { assigneeId } to scope to one employee.
   */
  const loadTasks = async (params = {}) => {
    return dispatch(fetchTasksThunk(params));
  };

  /**
   * Create a new task.
   * @param {{ title: string, category: string, assigneeId: string, dueDate: string }} payload
   * @returns {Promise<Task | undefined>} the newly created task, or undefined on error
   */
  const createNewTask = async (payload) => {
    const result = await dispatch(createTaskThunk(payload));
    // createTaskThunk.fulfilled payload is the task object
    if (createTaskThunk.fulfilled.match(result)) {
      return result.payload;
    }
    // Error is already written to state.tasks.error
    return undefined;
  };

  /**
   * Patch a task's status.
   * @param {string} taskId
   * @param {"new"|"active"|"done"|"failed"} status
   */
  const changeTaskStatus = async (taskId, status) => {
    return dispatch(updateTaskStatusThunk({ taskId, status }));
  };

  /** Dismiss the error banner without triggering a new request. */
  const dismissError = () => dispatch(clearTaskError());

  return {
    // State
    tasks:   items,
    loading,
    error,

    // Derived
    openCount,
    doneCount,
    tasksByStatus,

    // Actions
    loadTasks,
    createNewTask,
    changeTaskStatus,
    dismissError,
  };
}