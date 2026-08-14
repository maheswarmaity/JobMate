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
          setMessage(
            response.data.message || "Job not found"
          );
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load job details"
        );
      } finally {
        setLoading(false);
      }
    };

    getJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-loading">
          <h2>Loading job details...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="job-details-page">
        <div className="job-details-error">
          <h2>Unable to load job</h2>
          <p>{message}</p>

          <Link to="/jobs" className="back-jobs-button">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="job-details-error">
          <h2>Job not found</h2>

          <Link to="/jobs" className="back-jobs-button">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-details-container">

        <Link to="/jobs" className="back-link">
          ← Back to Jobs
        </Link>

        <div className="job-details-header">
          <div>
            <h1>{job.title}</h1>

            <p className="details-company">
              {job.company}
            </p>
          </div>

          <span className="details-job-type">
            {job.jobType}
          </span>
        </div>

        <div className="job-details-content">

          <section className="details-section">
            <h2>Job Description</h2>

            <p className="job-description">
              {job.description ||
                "No job description provided."}
            </p>
          </section>

          <section className="details-section">
            <h2>Job Information</h2>

            <div className="details-info-grid">

              <div className="details-info-card">
                <span>📍 Location</span>
                <strong>{job.location}</strong>
              </div>

              <div className="details-info-card">
                <span>💰 Salary</span>
                <strong>₹{job.salary}</strong>
              </div>

              <div className="details-info-card">
                <span>💼 Experience</span>
                <strong>{job.experience}</strong>
              </div>

              <div className="details-info-card">
                <span>🕒 Job Type</span>
                <strong>{job.jobType}</strong>
              </div>

            </div>
          </section>

          <section className="details-section">
            <h2>Required Skills</h2>

            <div className="details-skills">
              {job.skills?.length > 0 ? (
                job.skills.map((skill, index) => (
                  <span key={index}>
                    {skill}
                  </span>
                ))
              ) : (
                <p>No specific skills mentioned.</p>
              )}
            </div>
          </section>

          <div className="apply-section">
            <div>
              <h3>Interested in this opportunity?</h3>

              <p>
                Apply now and take the next step in your
                career.
              </p>
            </div>

            <Link
              to={`/jobs/${job._id}/apply`}
              className="apply-job-button"
            >
              Apply for Job →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetails;

