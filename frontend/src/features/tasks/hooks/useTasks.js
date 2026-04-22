// src/features/tasks/hooks/useTasks.js
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setLoading,
  setError,
  clearError,
} from "../tasks.slice";
import {
  fetchAllTasks,
  fetchMyTasks,
  createTask,
  updateTaskStatus as apiUpdateStatus,
  updateTask      as apiUpdateTask,
  deleteTask      as apiDeleteTask,
} from "../services/tasks.api";

export function useTasks() {
  const dispatch = useDispatch();
  const { items: tasks, isLoading: loading, error } = useSelector((s) => s.tasks);

  // ── Derived counts ───────────────────────────────────────────────────────
  const openCount = tasks.filter((t) => t.status === "new" || t.status === "active").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  // ── Async helper ─────────────────────────────────────────────────────────
  const run = async (fn) => {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));
      return await fn();
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      dispatch(setError(msg));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Load all tasks (Admin). */
  const loadTasks = () => run(async () => {
    const data = await fetchAllTasks();
    dispatch(setTasks(data.tasks ?? []));
    return data.tasks;
  });

  /** Load only the logged-in employee's tasks. */
  const loadMyTasks = () => run(async () => {
    const data = await fetchMyTasks();
    dispatch(setTasks(data.tasks ?? []));
    return data.tasks;
  });

  /**
   * Create a new task.
   * Payload:
   *   { title, description, date, category, assignedTo, assigneeName }
   *
   * `assigneeName` is UI-only metadata — not sent to backend.
   * `date` maps to the backend `date` field.
   */
  const createNewTask = ({ assigneeName, ...rest }) => run(async () => {
    const data = await createTask(rest);   // { title, description, date, category, assignedTo }
    // Merge assigneeName back so the task renders correctly in the list
    dispatch(addTask({ ...data.task, assigneeName }));
    return data.task;
  });

  /** Update task status. */
  const changeTaskStatus = (id, status) => run(async () => {
    const data = await apiUpdateStatus(id, status);
    dispatch(updateTask(data.task));
    return data.task;
  });

  /** Edit task fields. */
  const editTask = (id, fields) => run(async () => {
    const data = await apiUpdateTask(id, fields);
    dispatch(updateTask(data.task));
    return data.task;
  });

  /** Delete a task. */
  const removeTaskById = (id) => run(async () => {
    await apiDeleteTask(id);
    dispatch(removeTask(id));
    return true;
  });

  /** Dismiss the current error from the store. */
  const dismissError = () => dispatch(clearError());

  return {
    tasks,
    loading,
    error,
    openCount,
    doneCount,
    loadTasks,
    loadMyTasks,
    createNewTask,
    changeTaskStatus,
    editTask,
    removeTaskById,
    dismissError,
  };
}