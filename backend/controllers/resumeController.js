import User from "../models/User.js";

export const uploadResume = async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({
                success: false,
                message: "Only candidates can upload resumes"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume"
            });
        }

        const resumePath = `/uploads/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                resume: resumePath
            },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: user.resume
        });

    } catch (error) {
        console.error("Resume upload error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getResume = async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({
                success: false,
                message: "Only candidates can view their resume"
            });
        }

        const user = await User.findById(req.user.userId)
            .select("name email resume");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.resume) {
            return res.status(404).json({
                success: false,
                message: "No resume uploaded"
            });
        }

        res.status(200).json({
            success: true,
            resume: user.resume
        });

    } catch (error) {
        console.error("Get resume error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const deleteResume = async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({
                success: false,
                message: "Only candidates can delete resumes"
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.resume) {
            return res.status(404).json({
                success: false,
                message: "No resume found"
            });
        }

        user.resume = "";
        await user.save();

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully"
        });

    } catch (error) {
        console.error("Delete resume error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};