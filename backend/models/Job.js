import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      default: 0,
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Remote"],
      default: "Full-Time",
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    skills: {
      type: [String],
      default: [],
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;