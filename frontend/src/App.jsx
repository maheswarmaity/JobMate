import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedTest from "./pages/ProtectedTest";
import ProtectedRoute from "./components/ProtectedRoute";
import CandidateDashboard from "./pages/CandidateDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";
import "./App.css";

function Navigation() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      {!token && (
        <>
          <Link to="/login">Login</Link>
          {" | "}
          <Link to="/register">Register</Link>
        </>
      )}

      {token && user?.role === "candidate" && (
        <>
          <Link to="/candidate-dashboard">
            Candidate Dashboard
          </Link>
          {" | "}
          <Link to="/jobs">Jobs</Link>
          {" | "}
          <Link to="/my-applications">
            My Applications
          </Link>
          {" | "}
          <Link to="/profile">Profile</Link>
          {" | "}
          <Link to="/resume">Resume</Link>
        </>
      )}

      {token && user?.role === "recruiter" && (
        <>
          <Link to="/recruiter-dashboard">
            Recruiter Dashboard
          </Link>
          {" | "}
          <Link to="/create-job">Create Job</Link>
          {" | "}
          <Link to="/profile">Profile</Link>
        </>
      )}

      {token && (
        <>
          {" | "}
          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />

        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedTest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidate-dashboard"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={<JobList />}
          />

          <Route
            path="/jobs/:id"
            element={<JobDetails />}
          />

          <Route
            path="/jobs/:id/apply"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <ApplyJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <Resume />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-job"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <CreateJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <EditJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applicants/:jobId"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <Applicants />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

