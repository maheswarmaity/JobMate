import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
    skills: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await API.post(
        "/jobs",
        {
          title: formData.title,
          company: formData.company,
          description: formData.description,
          location: formData.location,
          salary: Number(formData.salary),
          jobType: formData.jobType,
          experience: formData.experience,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage("Job created successfully!");

        setTimeout(() => {
          navigate("/recruiter-dashboard");
        }, 1000);
      } else {
        setMessage(
          response.data.message || "Failed to create job"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job">
      <h1>Create Job</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          required
        >
          <option value="">Select Job Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
        </select>

        <input
          type="text"
          name="experience"
          placeholder="Experience (e.g. 0-2 years)"
          value={formData.experience}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (JavaScript, React, Node.js)"
          value={formData.skills}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateJob;

