import express from "express";
import "dotenv/config"
import router from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import userRouter from "./routes/user.routes.js";

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser())
app.use(morgan("dev"))

// Routes
app.use("api/auth",userRouter)
app.use("api/tasks",taskRouter)

export default app