// src/features/tasks/service/tasks.api.js
import axios from "axios";

// ── Shared Axios instance (mirrors auth.api.js pattern) ──────────────────────
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ── Fetch all tasks (optionally filtered by assigneeId) ──────────────────────
export async function fetchAllTasks({ assigneeId } = {}) {
  const params = assigneeId ? { assigneeId } : {};
  const response = await api.get("/api/tasks", { params });
  return response.data; // { tasks: Task[] }
}

// ── Create a new task ────────────────────────────────────────────────────────
// payload: { title, category, assigneeId, dueDate }
export async function createTask(payload) {
  const response = await api.post("/api/tasks", payload);
  return response.data; // { task: Task }
}

// ── Update a task's status ────────────────────────────────────────────────────
// status: "new" | "active" | "done" | "failed"
export async function updateTaskStatus(taskId, status) {
  const response = await api.patch(`/api/tasks/${taskId}/status`, { status });
  return response.data; // { task: Task }
}