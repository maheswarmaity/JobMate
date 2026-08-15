import { useEffect, useState } from "react";
import API from "../services/api";

const Resume = () => {
  const [resume, setResume] = useState("");
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");

  const getResume = async () => {
    try {
      const response = await API.get("/resume", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setResume(response.data.resume || "");
      } else {
        setMessage(
          response.data.message ||
            "Failed to load resume"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load resume"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResume();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setMessage(
        "Please select a PDF, DOC, or DOCX file."
      );
      return;
    }

    setMessage("");
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage(
        "Please select a resume file first."
      );
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("resume", file);

      const response = await API.post(
        "/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setResume(response.data.resume);

        setMessage(
          "Resume uploaded successfully!"
        );

        setFile(null);

        const fileInput =
          document.getElementById(
            "resume-file"
          );

        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        setMessage(
          response.data.message ||
            "Resume upload failed"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Resume upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your resume?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(true);
      setMessage("");

      const response = await API.delete(
        "/resume",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setResume("");

        setMessage(
          "Resume deleted successfully!"
        );
      } else {
        setMessage(
          response.data.message ||
            "Resume deletion failed"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Resume deletion failed"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="resume-page">
        <div className="resume-loading">
          <h2>Loading resume...</h2>
          <p>
            Please wait while we load your resume.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-page">

      <div className="resume-container">

        <div className="resume-header">
          <div className="resume-icon">
            📄
          </div>

          <div>
            <h1>My Resume</h1>

            <p>
              Upload and manage your resume for
              job applications.
            </p>
          </div>
        </div>

        <div className="resume-upload-card">

          <h2>Upload Resume</h2>

          <p className="resume-help-text">
            Supported formats: PDF, DOC, DOCX
          </p>

          <form onSubmit={handleUpload}>

            <div className="resume-file-box">

              <label
                htmlFor="resume-file"
                className="resume-file-label"
              >
                <span className="upload-icon">
                  ⬆
                </span>

                <span>
                  {file
                    ? file.name
                    : "Choose your resume"}
                </span>
              </label>

              <input
                id="resume-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

            </div>

            {file && (
              <p className="selected-file">
                Selected:{" "}
                <strong>{file.name}</strong>
              </p>
            )}

            <button
              type="submit"
              className="upload-resume-button"
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : "Upload Resume"}
            </button>

          </form>

        </div>

        {resume ? (
          <div className="resume-current-card">

            <div className="resume-current-header">

              <div>
                <h2>Current Resume</h2>

                <p>
                  Your resume is ready to use for
                  job applications.
                </p>
              </div>

              <span className="resume-status">
                Available
              </span>

            </div>

            <div className="resume-file-info">

              <div className="resume-document-icon">
                📄
              </div>

              <div className="resume-file-details">

                <strong>
                  Resume
                </strong>

                <span>
                  {resume}
                </span>

              </div>

            </div>

            <div className="resume-actions">

              <a
                href={`http://localhost:5000${resume}`}
                target="_blank"
                rel="noreferrer"
                className="view-resume-button"
              >
                View Resume
              </a>

              <button
                type="button"
                onClick={handleDelete}
                className="delete-resume-button"
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Resume"}
              </button>

            </div>

          </div>
        ) : (
          <div className="resume-empty-card">

            <div className="empty-resume-icon">
              📄
            </div>

            <h2>No Resume Uploaded</h2>

            <p>
              Upload your resume to make it
              available when applying for jobs.
            </p>

          </div>
        )}

        {message && (
          <div
            className={`resume-message ${
              message.includes("successfully")
                ? "resume-success"
                : "resume-error"
            }`}
          >
            {message}
          </div>
        )}

      </div>

    </div>
  );
};

export default Resume;

