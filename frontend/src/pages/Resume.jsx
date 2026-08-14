import { useEffect, useState } from "react";
import API from "../services/api";

const Resume = () => {
  const [resume, setResume] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load resume"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResume();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a resume file");
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
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setResume(response.data.resume);
        setMessage("Resume uploaded successfully!");
        setFile(null);
      } else {
        setMessage(
          response.data.message || "Resume upload failed"
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
    try {
      setMessage("");

      const response = await API.delete("/resume", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setResume("");
        setMessage("Resume deleted successfully!");
      } else {
        setMessage(
          response.data.message || "Resume deletion failed"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Resume deletion failed"
      );
    }
  };

  if (loading) {
    return <div>Loading resume...</div>;
  }

  return (
    <div className="resume-page">
      <h1>My Resume</h1>

      <form onSubmit={handleUpload}>
        <div>
          <label>Select Resume</label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>

      {resume && (
        <div>
          <h2>Uploaded Resume</h2>

          <p>{resume}</p>

          <a
            href={`http://localhost:5000${resume}`}
            target="_blank"
            rel="noreferrer"
          >
            View Resume
          </a>

          <br />

          <button onClick={handleDelete}>
            Delete Resume
          </button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Resume;

