import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const EditJob = () => {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getJob = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get(`/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const job = response.data.job;

          setFormData({
            title: job.title || "",
            company: job.company || "",
            description: job.description || "",
            location: job.location || "",
            salary: job.salary || "",
            jobType: job.jobType || "",
            experience: job.experience || "",
            skills: job.skills?.join(", ") || "",
          });
        } else {
          setMessage(
            response.data.message || "Failed to load job"
          );
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load job"
        );
      } finally {
        setLoading(false);
      }
    };

    getJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await API.put(
        `/jobs/${id}`,
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
        setMessage("Job updated successfully!");

        setTimeout(() => {
          navigate("/recruiter-dashboard");
        }, 1000);
      } else {
        setMessage(
          response.data.message || "Job update failed"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Job update failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading job...</div>;
  }

  return (
    <div className="edit-job">
      <h1>Edit Job</h1>

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
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills"
          value={formData.skills}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={updating}>
          {updating ? "Updating..." : "Update Job"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default EditJob;

