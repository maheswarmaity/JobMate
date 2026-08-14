import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await API.get("/jobs");

        if (response.data.success) {
          setJobs(response.data.jobs);
        } else {
          setMessage(response.data.message || "Failed to load jobs");
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Failed to load jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <div className="job-list">
      <h1>Available Jobs</h1>

      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h2>{job.title}</h2>

              <p>
                <strong>Company:</strong> {job.company}
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

              <Link to={`/jobs/${job._id}`}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
