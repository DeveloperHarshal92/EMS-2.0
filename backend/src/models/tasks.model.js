import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim : true,
  },
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  category: {
    type: String,
    required: [true, "Catagory is required"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  newTask: {
    type: Boolean,
    default: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  failed: {
    type: Boolean,
    default: false,
  },
});

const taskModel = mongoose.model("tasks", taskSchema);

export default taskModel;
