import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/dashboard/recruiter", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setDashboard(response.data.dashboard);
        } else {
          setMessage(
            response.data.message || "Failed to load dashboard"
          );
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load recruiter dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await API.delete(`/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDashboard((prev) => ({
          ...prev,
          jobs: prev.jobs.filter((job) => job._id !== jobId),
          totalJobs: Math.max((prev.totalJobs || 1) - 1, 0),
        }));

        setMessage("Job deleted successfully!");
      } else {
        setMessage(
          response.data.message || "Failed to delete job"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete job"
      );
    }
  };

  if (loading) {
    return (
      <div className="recruiter-dashboard-loading">
        <h2>Loading recruiter dashboard...</h2>
        <p>Please wait while we load your dashboard.</p>
      </div>
    );
  }

  if (message && !dashboard) {
    return (
      <div className="recruiter-dashboard-error">
        {message}
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="recruiter-dashboard-error">
        No dashboard data found.
      </div>
    );
  }

  const jobs = dashboard.jobs || [];
  const applications = dashboard.applications || [];

  return (
    <div className="recruiter-dashboard">

      {/* Header */}
      <div className="recruiter-header">
        <div>
          <h1>Recruiter Dashboard</h1>
          <p>
            Welcome back, {dashboard.profile?.name || "Recruiter"}
          </p>
        </div>

        <button
          className="create-job-button"
          onClick={() => navigate("/create-job")}
        >
          + Create Job
        </button>
      </div>

      {/* Statistics */}
      <div className="recruiter-stats">
        <div className="recruiter-stat-card">
          <span>Total Jobs</span>
          <strong>{dashboard.totalJobs || 0}</strong>
        </div>

        <div className="recruiter-stat-card">
          <span>Total Applications</span>
          <strong>{dashboard.totalApplications || 0}</strong>
        </div>

        <div className="recruiter-stat-card">
          <span>Shortlisted</span>
          <strong>{dashboard.shortlisted || 0}</strong>
        </div>

        <div className="recruiter-stat-card">
          <span>Selected</span>
          <strong>{dashboard.selected || 0}</strong>
        </div>

        <div className="recruiter-stat-card">
          <span>Rejected</span>
          <strong>{dashboard.rejected || 0}</strong>
        </div>
      </div>

      {/* Profile */}
      <section className="recruiter-section">
        <div className="section-header">
          <div>
            <h2>Profile</h2>
            <p>Your recruiter account information.</p>
          </div>
        </div>

        <div className="recruiter-profile">
          <div>
            <span>Name</span>
            <strong>
              {dashboard.profile?.name || "Not available"}
            </strong>
          </div>

          <div>
            <span>Email</span>
            <strong>
              {dashboard.profile?.email || "Not available"}
            </strong>
          </div>

          <div>
            <span>Role</span>
            <strong>
              {dashboard.profile?.role || "Recruiter"}
            </strong>
          </div>
        </div>
      </section>

      {/* My Jobs */}
      <section className="recruiter-section">
        <div className="section-header">
          <div>
            <h2>My Jobs</h2>
            <p>Manage the jobs you have posted.</p>
          </div>

          <button
            className="secondary-button"
            onClick={() => navigate("/create-job")}
          >
            + Add Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No jobs created yet</h3>

            <p>
              Create your first job to start receiving
              applications.
            </p>

            <button
              className="create-job-button"
              onClick={() => navigate("/create-job")}
            >
              Create Job
            </button>
          </div>
        ) : (
          <div className="recruiter-jobs-grid">
            {jobs.map((job) => (
              <div
                className="recruiter-job-card"
                key={job._id}
              >
                <div className="job-card-top">
                  <div>
                    <h3>{job.title}</h3>
                    <p>{job.company}</p>
                  </div>

                  <span className="job-type-badge">
                    {job.jobType}
                  </span>
                </div>

                <div className="job-details">
                  <p>
                    <strong>Location:</strong>{" "}
                    {job.location || "Not specified"}
                  </p>

                  <p>
                    <strong>Salary:</strong>{" "}
                    {job.salary
                      ? `₹${job.salary}`
                      : "Not specified"}
                  </p>

                  <p>
                    <strong>Experience:</strong>{" "}
                    {job.experience || "Not specified"}
                  </p>

                  <p>
                    <strong>Skills:</strong>{" "}
                    {job.skills?.length
                      ? job.skills.join(", ")
                      : "Not specified"}
                  </p>
                </div>

                <div className="job-actions">
                  <button
                    className="edit-button"
                    onClick={() =>
                      navigate(`/edit-job/${job._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="applicants-button"
                    onClick={() =>
                      navigate(`/applicants/${job._id}`)
                    }
                  >
                    Applicants
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteJob(job._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Applications */}
      <section className="recruiter-section">
        <div className="section-header">
          <div>
            <h2>Recent Applications</h2>
            <p>
              Review candidates who applied for your jobs.
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <h3>No applications received yet</h3>

            <p>
              Applications will appear here when candidates
              apply.
            </p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div
                className="recruiter-application-card"
                key={application._id}
              >
                <div className="application-header">
                  <div>
                    <h3>
                      {application.candidate?.name ||
                        "Unknown Candidate"}
                    </h3>

                    <p>
                      {application.candidate?.email ||
                        "Email not available"}
                    </p>
                  </div>

                  <span className="status">
                    {application.status || "Pending"}
                  </span>
                </div>

                <div className="application-info">
                  <p>
                    <strong>Job:</strong>{" "}
                    {application.job?.title ||
                      "Not available"}
                  </p>

                  <p>
                    <strong>Company:</strong>{" "}
                    {application.job?.company ||
                      "Not available"}
                  </p>

                  <p>
                    <strong>Resume:</strong>{" "}
                    {application.resume ||
                      "Not provided"}
                  </p>

                  <p>
                    <strong>Cover Letter:</strong>{" "}
                    {application.coverLetter ||
                      "Not provided"}
                  </p>
                </div>

                {application.job?._id && (
                  <button
                    className="applicants-button full-button"
                    onClick={() =>
                      navigate(
                        `/applicants/${application.job._id}`
                      )
                    }
                  >
                    View Applicants
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Message */}
      {message && (
        <div className="recruiter-message">
          {message}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;

