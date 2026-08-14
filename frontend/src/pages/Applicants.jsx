import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        setApplications(response.data.applications);
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
        {
          status,
        },
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
              ? {
                  ...application,
                  status,
                }
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

  if (loading) {
    return <div>Loading applicants...</div>;
  }

  return (
    <div className="applicants-page">
      <h1>Job Applicants</h1>

      {message && <p>{message}</p>}

      {applications.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <div className="applications-grid">
          {applications.map((application) => (
            <div
              className="application-card"
              key={application._id}
            >
              <h2>
                {application.candidate?.name ||
                  "Unknown Candidate"}
              </h2>

              <p>
                <strong>Email:</strong>{" "}
                {application.candidate?.email || "Not available"}
              </p>

              <p>
                <strong>Job:</strong>{" "}
                {application.job?.title || "Not available"}
              </p>

              <p>
                <strong>Company:</strong>{" "}
                {application.job?.company || "Not available"}
              </p>

              <p>
                <strong>Resume:</strong>{" "}
                {application.resume || "Not provided"}
              </p>

              {application.resume && (
                <a
                  href={`http://localhost:5000${application.resume}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume
                </a>
              )}

              <p>
                <strong>Cover Letter:</strong>{" "}
                {application.coverLetter || "Not provided"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {application.status}
              </p>

              <div className="application-actions">
                <button
                  onClick={() =>
                    updateStatus(
                      application._id,
                      "Shortlisted"
                    )
                  }
                  disabled={application.status === "Shortlisted"}
                >
                  Shortlist
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      application._id,
                      "Rejected"
                    )
                  }
                  disabled={application.status === "Rejected"}
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      application._id,
                      "Selected"
                    )
                  }
                  disabled={application.status === "Selected"}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;

