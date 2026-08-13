import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

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