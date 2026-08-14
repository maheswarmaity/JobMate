import { createContext, useContext, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        try {
            setLoading(true);

            const response = await API.post("/auth/login", {
                email,
                password
            });

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);

                setUser(response.data.user || null);

                return {
                    success: true,
                    data: response.data
                };
            }

            return {
                success: false,
                message: response.data.message
            };

        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Login failed"
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password, role) => {
        try {
            setLoading(true);

            const response = await API.post("/auth/register", {
                name,
                email,
                password,
                role
            });

            return {
                success: response.data.success,
                data: response.data,
                message: response.data.message
            };

        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Registration failed"
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

