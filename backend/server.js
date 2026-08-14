import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import dashboardRoutes from "./dashboard/dashboardRoutes.js";

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/dashboard", dashboardRoutes);

// Test API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "JobMate API is running "
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`JobMate server running on port ${PORT}`);
});