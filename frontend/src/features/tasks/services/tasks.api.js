// src/features/tasks/services/tasks.api.js
import axios from "axios";

const api = axios.create({
  baseURL:"http://localhost:3000",
  withCredentials: true,
});

/**
 * Create a new task (Admin only).
 * Payload shape matches tasks.model.js:
 *   { title, description, date, category, assignedTo }
 */
export async function createTask({ title, description, date, category, assignedTo }) {
  const res = await api.post("/api/tasks", {
    title,
    description,   // ← required by tasks.model.js
    date,
    category,
    assignedTo,
  });
  return res.data;
}

/**
 * Fetch all tasks (Admin view).
 */
export async function fetchAllTasks() {
  const res = await api.get("/api/tasks");
  return res.data;
}

/**
 * Fetch tasks assigned to the logged-in employee.
 */
export async function fetchMyTasks() {
  const res = await api.get("/api/tasks/my");
  return res.data;
}

/**
 * Update a task's status.
 * status: "active" | "completed" | "failed" | "newTask"
 */
export async function updateTaskStatus(id, status) {
  const res = await api.patch(`/api/tasks/${id}/status`, { status });
  return res.data;
}

/**
 * Update task details (Admin edit).
 */
export async function updateTask(id, { title, description, date, category }) {
  const res = await api.put(`/api/tasks/${id}`, { title, description, date, category });
  return res.data;
}

/**
 * Delete a task.
 */
export async function deleteTask(id) {
  const res = await api.delete(`/api/tasks/${id}`);
  return res.data;
}