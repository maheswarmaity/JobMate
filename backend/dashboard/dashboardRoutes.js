import express from "express";

import {
    getCandidateDashboard,
    getRecruiterDashboard
} from "./dashboardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/candidate",
    authMiddleware,
    getCandidateDashboard
);

router.get(
    "/recruiter",
    authMiddleware,
    getRecruiterDashboard
);

export default router;