import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const result = await login(
      formData.email,
      formData.password
    );

    if (result.success) {
      setMessage("Login successful!");

      setTimeout(() => {
        if (result.data?.user?.role === "recruiter") {
          navigate("/recruiter-dashboard");
        } else {
          navigate("/candidate-dashboard");
        }
      }, 500);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your JobMate account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            className={
              message === "Login successful!"
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </p>
        )}

        <div className="auth-footer">
          <p>
            Don't have an account?
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

