import { useEffect, useState } from "react";
import API from "../services/api";
import "./CandidateDashboard.css";

const CandidateDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/dashboard/candidate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setDashboard(response.data.dashboard);
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (message) {
    return <div className="dashboard-error">{message}</div>;
  }

  if (!dashboard) {
    return <div className="dashboard-error">No dashboard data found.</div>;
  }

  return (
    <div className="candidate-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Candidate Dashboard</h1>
          <p>Welcome back, {dashboard.profile.name}</p>
        </div>
      </div>

      <div className="stats-grid">
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

          <p>
            <strong>Skills:</strong>{" "}
            {dashboard.profile.skills?.length
              ? dashboard.profile.skills.join(", ")
              : "No skills added"}
          </p>

          <p>
            <strong>Education:</strong>{" "}
            {dashboard.profile.education || "Not added"}
          </p>

          <p>
            <strong>Experience:</strong>{" "}
            {dashboard.profile.experience || "Not added"}
          </p>

          <p>
            <strong>Resume:</strong>{" "}
            {dashboard.resumeAvailable ? "Available" : "Not uploaded"}
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Applications</h2>

        {dashboard.applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="applications-grid">
            {dashboard.applications.map((application) => (
              <div className="application-card" key={application._id}>
                <h3>{application.job?.title}</h3>

                <p>
                  <strong>Company:</strong> {application.job?.company}
                </p>

                <p>
                  <strong>Location:</strong> {application.job?.location}
                </p>

                <p>
                  <strong>Salary:</strong> ₹{application.job?.salary}
                </p>

                <p>
                  <strong>Job Type:</strong> {application.job?.jobType}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="status">
                    {application.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;

