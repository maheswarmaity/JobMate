import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setMessage("Job ID is missing");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await API.post(
        "/applications",
        {
          jobId: id,
          resume,
          coverLetter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage("Job application submitted successfully!");

        setTimeout(() => {
          navigate("/candidate-dashboard");
        }, 1000);
      } else {
        setMessage(response.data.message || "Application failed");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-job">
      <h1>Apply for Job</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Resume</label>

          <input
            type="text"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="resume.pdf"
          />
        </div>

        <div>
          <label>Cover Letter</label>

          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter"
            rows="6"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ApplyJob;

