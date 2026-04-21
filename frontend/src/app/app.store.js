import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import tasksReducer from "../features/tasks/tasks.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});
