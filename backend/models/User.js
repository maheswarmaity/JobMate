import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: ["candidate", "recruiter"],
            default: "candidate"
        },

        skills: {
            type: [String],
            default: []
        },

        education: {
            type: String,
            default: ""
        },

        experience: {
            type: String,
            default: ""
        },

        resume: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;