import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyForJob = async (req, res) => {
    try {
        const { jobId, resume, coverLetter } = req.body;

        // Check job ID
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        // Only candidates can apply
        if (req.user.role !== "candidate") {
            return res.status(403).json({
                success: false,
                message: "Only candidates can apply for jobs"
            });
        }

        // Check whether job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check duplicate application
        const existingApplication = await Application.findOne({
            job: jobId,
            candidate: req.user.userId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            candidate: req.user.userId,
            resume: resume || "",
            coverLetter: coverLetter || ""
        });

        res.status(201).json({
            success: true,
            message: "Job application submitted successfully",
            application
        });

    } catch (error) {
        console.error("Apply for job error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getMyApplications = async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({
                success: false,
                message: "Only candidates can view their applications"
            });
        }

        const applications = await Application.find({
            candidate: req.user.userId
        })
            .populate("job", "title company location salary jobType experience")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error("Get my applications error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Only recruiters can view applicants
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                success: false,
                message: "Only recruiters can view applicants"
            });
        }

        // Check whether job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Only job owner can view applicants
        if (job.recruiter.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view applicants"
            });
        }

        const applications = await Application.find({
            job: jobId
        })
            .populate("candidate", "name email role")
            .populate("job", "title company")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error("Get applicants error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        // Only recruiters can update application status
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                success: false,
                message: "Only recruiters can update application status"
            });
        }

        // Validate status
        const allowedStatuses = [
            "Applied",
            "Shortlisted",
            "Rejected",
            "Selected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status"
            });
        }

        // Find application
        const application = await Application.findById(applicationId)
            .populate("job", "title company recruiter");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Only job owner can update status
        if (
            application.job.recruiter.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this application"
            });
        }

        application.status = status;

        await application.save();

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        console.error("Update application status error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};