import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getCandidateDashboard = async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({
                success: false,
                message: "Only candidates can access this dashboard"
            });
        }

        const user = await User.findById(req.user.userId)
            .select("name email role skills education experience resume");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const applications = await Application.find({
            candidate: req.user.userId
        })
            .populate("job", "title company location salary jobType")
            .sort({ createdAt: -1 });

        const totalApplications = applications.length;

        const shortlisted = applications.filter(
            app => app.status === "Shortlisted"
        ).length;

        const selected = applications.filter(
            app => app.status === "Selected"
        ).length;

        const rejected = applications.filter(
            app => app.status === "Rejected"
        ).length;

        res.status(200).json({
            success: true,
            dashboard: {
                profile: user,
                resumeAvailable: Boolean(user.resume),
                totalApplications,
                shortlisted,
                selected,
                rejected,
                applications
            }
        });

    } catch (error) {
        console.error("Candidate dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getRecruiterDashboard = async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                success: false,
                message: "Only recruiters can access this dashboard"
            });
        }

        const user = await User.findById(req.user.userId)
            .select("name email role");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Recruiter not found"
            });
        }

        const jobs = await Job.find({
            recruiter: req.user.userId
        }).sort({ createdAt: -1 });

        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({
            job: { $in: jobIds }
        })
            .populate("candidate", "name email")
            .populate("job", "title company location")
            .sort({ createdAt: -1 });

        const totalJobs = jobs.length;
        const totalApplications = applications.length;

        const shortlisted = applications.filter(
            app => app.status === "Shortlisted"
        ).length;

        const selected = applications.filter(
            app => app.status === "Selected"
        ).length;

        const rejected = applications.filter(
            app => app.status === "Rejected"
        ).length;

        res.status(200).json({
            success: true,
            dashboard: {
                profile: user,
                totalJobs,
                totalApplications,
                shortlisted,
                selected,
                rejected,
                jobs,
                applications
            }
        });

    } catch (error) {
        console.error("Recruiter dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};