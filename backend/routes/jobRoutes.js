import express from "express";

import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} from "../controllers/jobController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createJob);

router.get("/", getAllJobs);

router.get("/:id", getJobById);

router.put("/:id", authMiddleware, updateJob);

router.delete("/:id", authMiddleware, deleteJob);

export default router;