import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const response = await API.get(`/jobs/${id}`);

        if (response.data.success) {
          setJob(response.data.job);
        } else {
          setMessage(response.data.message || "Job not found");
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Failed to load job details"
        );
      } finally {
        setLoading(false);
      }
    };

    getJobDetails();
  }, [id]);

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (message) {
    return <div>{message}</div>;
  }

  if (!job) {
    return <div>Job not found.</div>;
  }

  return (
    <div className="job-details">
      <h1>{job.title}</h1>

      <p>
        <strong>Company:</strong> {job.company}
      </p>

      <p>
        <strong>Description:</strong> {job.description}
      </p>

      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <p>
        <strong>Salary:</strong> ₹{job.salary}
      </p>

      <p>
        <strong>Job Type:</strong> {job.jobType}
      </p>

      <p>
        <strong>Experience:</strong> {job.experience}
      </p>

      <p>
        <strong>Skills:</strong>{" "}
        {job.skills?.join(", ")}
      </p>

      <Link to={`/jobs/${job._id}/apply`}>
        Apply for Job
      </Link>
    </div>
  );
};

export default JobDetails;

