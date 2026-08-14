import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
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

            // পরে এখানে dashboard-এর দিকে পাঠাব
            setTimeout(() => {
                navigate("/");
            }, 500);
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {message && <p>{message}</p>}

            <p>
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>
            </p>
        </div>
    );
};

export default Login;

