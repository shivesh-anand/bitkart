import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

//connect to DB
connectDB();

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
// app.use('/api/v1/item', itemRoutes);
// app.use('/api/v1/chat', chatRoutes);
export default app;
