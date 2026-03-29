import taskModel from "../models/tasks.model.js";
import userModel from "../models/user.model.js";

// CREATE TASK (ADMIN)
export const createTask = async (req, res) => {
  try {
    const { title, description, date, category, assignedTo } = req.body;

    const user = await userModel.findById(assignedTo);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const task = await taskModel.create({
      title,
      description,
      date,
      category,
      newTask: true,
    });

    user.tasks.push(task._id);
    await user.save();

    res.status(201).json({
      message: "Task created successfully",
      success: true,
      task,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      success: false,
      error: error.message,
    });
  }
};

// GET MY TASKS (EMPLOYEE)
export const getMyTasks = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("tasks");

    res.status(200).json({
      success: true,
      tasks: user.tasks,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      success: false,
    });
  }
};

// GET ALL TASKS (ADMIN)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find();

    res.status(200).json({
      success: true,
      tasks,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching all tasks",
      success: false,
    });
  }
};

// UPDATE TASK STATUS
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updateFields = {
      active: false,
      newTask: false,
      completed: false,
      failed: false,
    };

    updateFields[status] = true;

    const task = await taskModel.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.status(200).json({
      message: "Task status updated",
      success: true,
      task,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating status",
      success: false,
    });
  }
};

// UPDATE TASK (ADMIN EDIT)
export const updateTask = async (req, res) => {
  try {
    const { title, description, date, category } = req.body;

    const task = await taskModel.findByIdAndUpdate(
      req.params.id,
      { title, description, date, category },
      { new: true }
    );

    res.status(200).json({
      message: "Task updated",
      success: true,
      task,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      success: false,
    });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    await taskModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task deleted",
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting task",
      success: false,
    });
  }
};