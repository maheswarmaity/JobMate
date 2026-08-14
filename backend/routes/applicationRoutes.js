import express from "express";
import {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus
} from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, applyForJob);

router.get("/my", authMiddleware, getMyApplications);

router.get(
    "/job/:jobId/applicants",
    authMiddleware,
    getJobApplicants
);

router.put(
    "/:applicationId/status",
    authMiddleware,
    updateApplicationStatus
);

export default router;