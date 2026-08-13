import Job from "../models/Job.js";

export const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            description,
            location,
            salary,
            jobType,
            experience,
            skills
        } = req.body;

        // Required fields
        if (!title || !company || !description || !location) {
            return res.status(400).json({
                success: false,
                message: "Title, company, description and location are required"
            });
        }

        // Only recruiter can create jobs
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                success: false,
                message: "Only recruiters can create jobs"
            });
        }

        const job = await Job.create({
            title,
            company,
            description,
            location,
            salary: salary || 0,
            jobType: jobType || "Full-Time",
            experience: experience || "Fresher",
            skills: skills || [],
            recruiter: req.user.userId
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create job error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const {
            search,
            location,
            jobType,
            experience,
            minSalary,
            maxSalary,
            page = 1,
            limit = 5
        } = req.query;

        const filter = {};

        // Search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } }
            ];
        }

        // Filters
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        if (jobType) {
            filter.jobType = jobType;
        }

        if (experience) {
            filter.experience = {
                $regex: experience,
                $options: "i"
            };
        }

        // Salary filter
        if (minSalary || maxSalary) {
            filter.salary = {};

            if (minSalary) {
                filter.salary.$gte = Number(minSalary);
            }

            if (maxSalary) {
                filter.salary.$lte = Number(maxSalary);
            }
        }

        const currentPage = Number(page);
        const jobsPerPage = Number(limit);

        const skip = (currentPage - 1) * jobsPerPage;

        const totalJobs = await Job.countDocuments(filter);

        const jobs = await Job.find(filter)
            .populate("recruiter", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(jobsPerPage);

        const totalPages = Math.ceil(totalJobs / jobsPerPage);

        res.status(200).json({
            success: true,
            count: jobs.length,
            totalJobs,
            totalPages,
            currentPage,
            jobs
        });

    } catch (error) {
        console.error("Search/filter jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("recruiter", "name email");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.error("Get job error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Only the recruiter who created the job can update it
        if (job.recruiter.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this job"
            });
        }

        const {
            title,
            company,
            description,
            location,
            salary,
            jobType,
            experience,
            skills
        } = req.body;

        if (title !== undefined) job.title = title;
        if (company !== undefined) job.company = company;
        if (description !== undefined) job.description = description;
        if (location !== undefined) job.location = location;
        if (salary !== undefined) job.salary = salary;
        if (jobType !== undefined) job.jobType = jobType;
        if (experience !== undefined) job.experience = experience;
        if (skills !== undefined) job.skills = skills;

        await job.save();

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.error("Update job error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Only the recruiter who created the job can delete it
        if (job.recruiter.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this job"
            });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};