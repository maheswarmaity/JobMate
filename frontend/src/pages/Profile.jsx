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

        const response = await API.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const user = response.data.user;

          setProfile(user);
          setSkills(user.skills?.join(", ") || "");
          setEducation(user.education || "");
          setExperience(user.experience || "");
        } else {
          setMessage(
            response.data.message || "Failed to load profile"
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
          education,
          experience,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProfile(response.data.user);
        setMessage("Profile updated successfully!");
      } else {
        setMessage(
          response.data.message || "Profile update failed"
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
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>{message || "Profile not found"}</div>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div>
        <p>
          <strong>Name:</strong> {profile.name}
        </p>

        <p>
          <strong>Email:</strong> {profile.email}
        </p>

        <p>
          <strong>Role:</strong> {profile.role}
        </p>
      </div>

      <form onSubmit={handleUpdate}>
        <div>
          <label>Skills</label>

          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="JavaScript, React, Node.js"
          />
        </div>

        <div>
          <label>Education</label>

          <textarea
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="Enter your education"
            rows="4"
          />
        </div>

        <div>
          <label>Experience</label>

          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Enter your experience"
            rows="4"
          />
        </div>

        <button type="submit" disabled={updating}>
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;

