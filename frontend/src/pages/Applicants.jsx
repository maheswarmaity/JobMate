import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

const Applicants = () => {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getApplicants = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        `/applications/job/${jobId}/applicants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setApplications(response.data.applications || []);
      } else {
        setMessage(
          response.data.message || "Failed to load applicants"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplicants();
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    try {
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await API.put(
        `/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setApplications((previousApplications) =>
          previousApplications.map((application) =>
            application._id === applicationId
              ? { ...application, status }
              : application
          )
        );

        setMessage(
          `Application ${status.toLowerCase()} successfully!`
        );
      } else {
        setMessage(
          response.data.message ||
            "Failed to update application status"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update application status"
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Shortlisted":
        return "status-shortlisted";

      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  if (loading) {
    return (
      <div className="applicants-loading">
        <h2>Loading applicants...</h2>
        <p>Please wait while we load the applications.</p>
      </div>
    );
  }

  return (
    <div className="applicants-page">
      {/* Header */}

      <div className="applicants-header">
        <div>
          <h1>Job Applicants</h1>
          <p>Review and manage candidates who applied for this job.</p>
        </div>

        <Link to="/recruiter-dashboard" className="back-dashboard-button">
          ← Dashboard
        </Link>
      </div>

      {/* Message */}

      {message && (
        <div className="applicants-message">
          {message}
        </div>
      )}

      {/* Empty State */}

      {applications.length === 0 ? (
        <div className="applicants-empty">
          <h2>No applicants found</h2>
          <p>
            There are no applications for this job yet.
          </p>
        </div>
      ) : (
        <>
          <div className="applicants-count">
            {applications.length}{" "}
            {applications.length === 1
              ? "Applicant"
              : "Applicants"}
          </div>

          {/* Applicants Grid */}

          <div className="applicants-grid">
            {applications.map((application) => (
              <div
                className="applicant-card"
                key={application._id}
              >
                {/* Candidate Header */}

                <div className="applicant-header">
                  <div>
                    <h2>
                      {application.candidate?.name ||
                        "Unknown Candidate"}
                    </h2>

                    <p>
                      {application.candidate?.email ||
                        "Email not available"}
                    </p>
                  </div>

                  <span
                    className={`applicant-status ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status || "Pending"}
                  </span>
                </div>

                {/* Job Information */}

                <div className="applicant-info">
                  <div className="info-item">
                    <span>Job</span>
                    <strong>
                      {application.job?.title ||
                        "Not available"}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Company</span>
                    <strong>
                      {application.job?.company ||
                        "Not available"}
                    </strong>
                  </div>

                  <div className="info-item">
                    <span>Resume</span>

                    {application.resume ? (
                      <a
                        href={`http://localhost:5000${application.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-link"
                      >
                        View Resume
                      </a>
                    ) : (
                      <strong>Not provided</strong>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}

                <div className="cover-letter">
                  <span>Cover Letter</span>

                  <p>
                    {application.coverLetter ||
                      "No cover letter provided."}
                  </p>
                </div>

                {/* Actions */}

                <div className="applicant-actions">
                  <button
                    className="shortlist-button"
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "Shortlisted"
                      )
                    }
                    disabled={
                      application.status === "Shortlisted"
                    }
                  >
                    Shortlist
                  </button>

                  <button
                    className="select-button"
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "Selected"
                      )
                    }
                    disabled={
                      application.status === "Selected"
                    }
                  >
                    Select
                  </button>

                  <button
                    className="reject-button"
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "Rejected"
                      )
                    }
                    disabled={
                      application.status === "Rejected"
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Applicants;

