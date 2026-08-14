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

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await API.delete(`/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDashboard((previousDashboard) => ({
          ...previousDashboard,
          jobs: previousDashboard.jobs.filter(
            (job) => job._id !== jobId
          ),
          totalJobs: previousDashboard.totalJobs - 1,
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
    return <div>Loading recruiter dashboard...</div>;
  }

  if (!dashboard) {
    return <div>{message || "No dashboard data found."}</div>;
  }

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-header">
        <h1>Recruiter Dashboard</h1>
        <p>Welcome back, {dashboard.profile.name}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p>{dashboard.totalJobs}</p>
        </div>

        <div className="stat-card">
          <h3>Total Applications</h3>
          <p>{dashboard.totalApplications}</p>
        </div>

        <div className="stat-card">
          <h3>Shortlisted</h3>
          <p>{dashboard.shortlisted}</p>
        </div>

        <div className="stat-card">
          <h3>Selected</h3>
          <p>{dashboard.selected}</p>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <p>{dashboard.rejected}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Profile</h2>

        <div className="profile-card">
          <p>
            <strong>Name:</strong> {dashboard.profile.name}
          </p>

          <p>
            <strong>Email:</strong> {dashboard.profile.email}
          </p>

          <p>
            <strong>Role:</strong> {dashboard.profile.role}
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Jobs</h2>

        {dashboard.jobs.length === 0 ? (
          <p>No jobs created yet.</p>
        ) : (
          <div className="applications-grid">
            {dashboard.jobs.map((job) => (
              <div
                className="application-card"
                key={job._id}
              >
                <h3>{job.title}</h3>

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

                <button
                  onClick={() =>
                    navigate(`/edit-job/${job._id}`)
                  }
                >
                  Edit Job
                </button>

                <button
                  onClick={() =>
                    handleDeleteJob(job._id)
                  }
                >
                  Delete Job
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Applications</h2>

        {dashboard.applications.length === 0 ? (
          <p>No applications received yet.</p>
        ) : (
          <div className="applications-grid">
            {dashboard.applications.map((application) => (
              <div
                className="application-card"
                key={application._id}
              >
                <h3>{application.job?.title}</h3>

                <p>
                  <strong>Candidate:</strong>{" "}
                  {application.candidate?.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {application.candidate?.email}
                </p>

                <p>
                  <strong>Company:</strong>{" "}
                  {application.job?.company}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="status">
                    {application.status}
                  </span>
                </p>

                <p>
                  <strong>Resume:</strong>{" "}
                  {application.resume || "Not provided"}
                </p>

                <p>
                  <strong>Cover Letter:</strong>{" "}
                  {application.coverLetter || "Not provided"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default RecruiterDashboard;

