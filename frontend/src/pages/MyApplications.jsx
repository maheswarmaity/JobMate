import { useEffect, useState } from "react";
import API from "../services/api";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/applications/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setApplications(response.data.applications);
        } else {
          setMessage(
            response.data.message ||
              "Failed to load applications"
          );
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, []);

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "shortlisted") {
      return "status-shortlisted";
    }

    if (value === "selected") {
      return "status-selected";
    }

    if (value === "rejected") {
      return "status-rejected";
    }

    return "status-applied";
  };

  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-loading">
          <h2>Loading applications...</h2>
          <p>
            Please wait while we load your applications.
          </p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="applications-page">
        <div className="applications-error">
          <h2>Unable to load applications</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">

      <div className="applications-header">
        <div>
          <h1>My Applications</h1>
          <p>
            Track all the jobs you have applied for.
          </p>
        </div>

        <div className="application-count">
          {applications.length}{" "}
          {applications.length === 1
            ? "Application"
            : "Applications"}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <div className="empty-icon">📄</div>

          <h2>No Applications Yet</h2>

          <p>
            You haven't applied for any jobs yet.
            Explore available jobs and start applying.
          </p>
        </div>
      ) : (
        <div className="applications-grid">

          {applications.map((application) => {
            const status =
              application.status || "Applied";

            return (
              <div
                className="application-card"
                key={application._id}
              >

                <div className="application-card-header">
                  <div>
                    <h2>
                      {application.job?.title ||
                        "Job Title Not Available"}
                    </h2>

                    <p className="application-company">
                      {application.job?.company ||
                        "Company not available"}
                    </p>
                  </div>

                  <span
                    className={`application-status ${getStatusClass(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="application-info">

                  <div>
                    <span>📍 Location</span>
                    <strong>
                      {application.job?.location ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>💰 Salary</span>
                    <strong>
                      {application.job?.salary
                        ? `₹${application.job.salary}`
                        : "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>💼 Job Type</span>
                    <strong>
                      {application.job?.jobType ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>🧑‍💻 Experience</span>
                    <strong>
                      {application.job?.experience ||
                        "Not available"}
                    </strong>
                  </div>

                </div>

                <div className="application-details">

                  <div className="application-detail-item">
                    <span>Resume</span>

                    <strong>
                      {application.resume ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="application-detail-item">
                    <span>Applied On</span>

                    <strong>
                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : "Not available"}
                    </strong>
                  </div>

                </div>

                <div className="cover-letter-section">
                  <h3>Cover Letter</h3>

                  <p>
                    {application.coverLetter ||
                      "No cover letter provided."}
                  </p>
                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default MyApplications;

