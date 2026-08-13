import User from "../models/User.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { name, skills, education, experience, resume } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name !== undefined) user.name = name;
        if (skills !== undefined) user.skills = skills;
        if (education !== undefined) user.education = education;
        if (experience !== undefined) user.experience = experience;
        if (resume !== undefined) user.resume = resume;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                skills: user.skills,
                education: user.education,
                experience: user.experience,
                resume: user.resume
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};