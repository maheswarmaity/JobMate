import express from "express";
import multer from "multer";
import path from "path";

import {
    uploadResume,
    getResume,
    deleteResume
} from "../controllers/resumeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,

    fileFilter: function (req, file, cb) {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, DOC and DOCX files are allowed"));
        }
    }
});

router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);

router.get(
    "/",
    authMiddleware,
    getResume
);

router.delete(
    "/",
    authMiddleware,
    deleteResume
);

export default router;