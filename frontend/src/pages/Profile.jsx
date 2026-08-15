import { useEffect, useState } from "react";
import API from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get(
          "/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const user = response.data.user;

          setProfile(user);

          setSkills(
            user.skills?.join(", ") || ""
          );

          setEducation(
            user.education || ""
          );

          setExperience(
            user.experience || ""
          );
        } else {
          setMessage(
            response.data.message ||
              "Failed to load profile"
          );
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await API.put(
        "/users/profile",
        {
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),

          education: education.trim(),

          experience: experience.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedUser =
          response.data.user;

        setProfile(updatedUser);

        setSkills(
          updatedUser.skills?.join(", ") || ""
        );

        setEducation(
          updatedUser.education || ""
        );

        setExperience(
          updatedUser.experience || ""
        );

        setMessage(
          "Profile updated successfully!"
        );
      } else {
        setMessage(
          response.data.message ||
            "Profile update failed"
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <h2>Loading profile...</h2>
          <p>
            Please wait while we load your profile.
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>Profile not found</h2>
          <p>
            {message ||
              "Unable to load your profile."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        <div className="profile-header">
          <div className="profile-avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your personal and professional
              information.
            </p>
          </div>
        </div>

        <div className="profile-info-card">

          <h2>Personal Information</h2>

          <div className="profile-info-grid">

            <div className="profile-info-item">
              <span>Name</span>
              <strong>
                {profile.name}
              </strong>
            </div>

            <div className="profile-info-item">
              <span>Email</span>
              <strong>
                {profile.email}
              </strong>
            </div>

            <div className="profile-info-item">
              <span>Role</span>
              <strong className="profile-role">
                {profile.role}
              </strong>
            </div>

          </div>

        </div>

        <form
          className="profile-form"
          onSubmit={handleUpdate}
        >

          <div className="profile-form-section">

            <h2>Professional Information</h2>

            <div className="profile-form-group">

              <label htmlFor="skills">
                Skills
              </label>

              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(e) =>
                  setSkills(e.target.value)
                }
                placeholder="JavaScript, React, Node.js"
                disabled={updating}
              />

              <small>
                Separate multiple skills with commas.
              </small>

            </div>

            <div className="profile-form-group">

              <label htmlFor="education">
                Education
              </label>

              <textarea
                id="education"
                value={education}
                onChange={(e) =>
                  setEducation(e.target.value)
                }
                placeholder="Example: B.Tech in Computer Science"
                rows={4}
                disabled={updating}
              />

            </div>

            <div className="profile-form-group">

              <label htmlFor="experience">
                Experience
              </label>

              <textarea
                id="experience"
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value)
                }
                placeholder="Example: Fresher / 1 year experience in web development"
                rows={4}
                disabled={updating}
              />

            </div>

          </div>

          <button
            type="submit"
            className="update-profile-button"
            disabled={updating}
          >
            {updating
              ? "Updating..."
              : "Update Profile"}
          </button>

        </form>

        {message && (
          <div
            className={`profile-message ${
              message.includes("successfully")
                ? "profile-success"
                : "profile-error-message"
            }`}
          >
            {message}
          </div>
        )}

      </div>

    </div>
  );
};

export default Profile;

