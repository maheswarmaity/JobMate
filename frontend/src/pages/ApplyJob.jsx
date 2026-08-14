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

    setMessage("");

    if (!id) {
      setMessage("Job ID is missing.");
      return;
    }

    if (!resume.trim()) {
      setMessage("Please enter your resume name.");
      return;
    }

    if (!coverLetter.trim()) {
      setMessage("Please write a cover letter.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await API.post(
        "/applications",
        {
          jobId: id,
          resume: resume.trim(),
          coverLetter: coverLetter.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage(
          "Job application submitted successfully!"
        );

        setTimeout(() => {
          navigate("/candidate-dashboard");
        }, 1200);
      } else {
        setMessage(
          response.data.message ||
            "Application failed"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-page">
      <div className="apply-container">

        <div className="apply-header">
          <h1>Apply for Job</h1>

          <p>
            Submit your resume and cover letter to apply
            for this opportunity.
          </p>
        </div>

        <form
          className="apply-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="resume">
              Resume
            </label>

            <input
              id="resume"
              type="text"
              value={resume}
              onChange={(e) =>
                setResume(e.target.value)
              }
              placeholder="Example: resume.pdf"
              disabled={loading}
            />

            <small>
              Enter the name of your uploaded resume.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">
              Cover Letter
            </label>

            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) =>
                setCoverLetter(e.target.value)
              }
              placeholder="Write a short cover letter explaining why you are suitable for this job..."
              rows={8}
              disabled={loading}
            />

            <small>
              Introduce yourself and explain why you
              are interested in this position.
            </small>
          </div>

          <button
            type="submit"
            className="submit-application-button"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Application"}
          </button>
        </form>

        {message && (
          <div
            className={`application-message ${
              message.includes("successfully")
                ? "success-message"
                : "error-message"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          ← Back
        </button>

      </div>
    </div>
  );
};

export default ApplyJob;

