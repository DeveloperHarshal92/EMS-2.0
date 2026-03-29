import { Router } from "express";
import { authUser } from "../middlewares/auth.middlware.js";

import {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller.js";

const taskRouter = Router();
/**
 * @route POST /api/tasks
 * @desc Create a new task
 * @access Protected
 */
taskRouter.post("/", authUser, createTask);

/**
 * @route GET /api/tasks
 * @desc Get all tasks (admin) or my tasks (employee)
 * @access Protected
 */
taskRouter.get("/", authUser, getAllTasks);

/**
 * @route GET /api/tasks/my
 * @desc Get my tasks (employee)
 * @access Protected
 */
taskRouter.get("/my", authUser, getMyTasks);

/**
 * @route PATCH /api/tasks/:id/status
 * @desc Update task status (complete, fail)
 * @access Protected
 */
taskRouter.patch("/:id/status", authUser, updateTaskStatus);

/**
 * @route PUT /api/tasks/:id
 * @desc Update task details
 * @access Protected
 */
taskRouter.put("/:id", authUser, updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @desc Delete a task
 * @access Protected
 */
taskRouter.delete("/:id", authUser, deleteTask);

export default taskRouter;
