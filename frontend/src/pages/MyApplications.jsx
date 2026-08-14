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
            response.data.message || "Failed to load applications"
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

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <div className="my-applications">
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p>You have not applied for any jobs yet.</p>
      ) : (
        <div className="applications-grid">
          {applications.map((application) => (
            <div
              className="application-card"
              key={application._id}
            >
              <h2>{application.job?.title}</h2>

              <p>
                <strong>Company:</strong>{" "}
                {application.job?.company}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {application.job?.location}
              </p>

              <p>
                <strong>Salary:</strong>{" "}
                ₹{application.job?.salary}
              </p>

              <p>
                <strong>Job Type:</strong>{" "}
                {application.job?.jobType}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {application.job?.experience}
              </p>

              <p>
                <strong>Resume:</strong>{" "}
                {application.resume || "Not provided"}
              </p>

              <p>
                <strong>Cover Letter:</strong>{" "}
                {application.coverLetter || "Not provided"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="status">
                  {application.status}
                </span>
              </p>

              <p>
                <strong>Applied:</strong>{" "}
                {new Date(
                  application.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;

