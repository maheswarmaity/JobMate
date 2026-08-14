import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await API.get("/jobs");

        if (response.data.success) {
          setJobs(response.data.jobs);
        } else {
          setMessage(
            response.data.message || "Failed to load jobs"
          );
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    return (
      job.title?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      job.location?.toLowerCase().includes(searchText) ||
      job.skills?.some((skill) =>
        skill.toLowerCase().includes(searchText)
      )
    );
  });

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-loading">
          <h2>Loading jobs...</h2>
          <p>Please wait while we find the latest opportunities.</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="jobs-page">
        <div className="jobs-message error-message">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div>
          <h1>Find Your Next Job</h1>
          <p>
            Explore opportunities and find the right job for
            your career.
          </p>
        </div>

        <div className="jobs-search">
          <input
            type="text"
            placeholder="Search by job, company, location or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="jobs-result-header">
        <h2>Available Jobs</h2>
        <span>
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1 ? "Job" : "Jobs"}
        </span>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="no-jobs">
          <h3>No jobs found</h3>
          <p>
            Try searching with a different keyword.
          </p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-card-header">
                <div>
                  <h2>{job.title}</h2>
                  <p className="job-company">
                    {job.company}
                  </p>
                </div>

                <span className="job-type">
                  {job.jobType}
                </span>
              </div>

              <div className="job-info">
                <p>
                  <strong>📍 Location</strong>
                  <span>{job.location}</span>
                </p>

                <p>
                  <strong>💰 Salary</strong>
                  <span>₹{job.salary}</span>
                </p>

                <p>
                  <strong>💼 Experience</strong>
                  <span>{job.experience}</span>
                </p>
              </div>

              <div className="job-skills">
                {job.skills?.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>

              <Link
                className="view-job-button"
                to={`/jobs/${job._id}`}
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;

