import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },

  profileImage: {
    type: String,
    default: "https://ik.imagekit.io/developerHarsh/Default_pfp.jpg?updatedAt=1770738282777",
  },

  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
    },
  ],
});

export default mongoose.model("users", userSchema);