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


/* =========================================
   Navigation
========================================= */

function Navigation() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    logout();

    navigate("/login");
  };


  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}

        <Link to="/" className="navbar-logo">
          JobMate
        </Link>


        {/* Navigation Links */}

        <div className="navbar-links">

          {/* Public Links */}

          {!token && (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>
            </>
          )}


          {/* Candidate Links */}

          {token && user?.role === "candidate" && (
            <>
              <Link to="/candidate-dashboard">
                Dashboard
              </Link>

              <Link to="/jobs">
                Jobs
              </Link>

              <Link to="/my-applications">
                My Applications
              </Link>

              <Link to="/profile">
                Profile
              </Link>

              <Link to="/resume">
                Resume
              </Link>
            </>
          )}


          {/* Recruiter Links */}

          {token && user?.role === "recruiter" && (
            <>
              <Link to="/recruiter-dashboard">
                Dashboard
              </Link>

              <Link to="/create-job">
                Create Job
              </Link>

              <Link to="/profile">
                Profile
              </Link>
            </>
          )}


          {/* Logout */}

          {token && (
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>

      </div>

    </nav>
  );
}


/* =========================================
   App
========================================= */

function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Navigation />


        <Routes>

          {/* ================================
              Public Routes
          ================================= */}

          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ================================
              Protected Test
          ================================= */}

          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedTest />
              </ProtectedRoute>
            }
          />


          {/* ================================
              Candidate Dashboard
          ================================= */}

          <Route
            path="/candidate-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["candidate"]}
              >
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />


          {/* ================================
              Jobs
          ================================= */}

          <Route
            path="/jobs"
            element={<JobList />}
          />


          <Route
            path="/jobs/:id"
            element={<JobDetails />}
          />


          {/* ================================
              Apply Job
          ================================= */}

          <Route
            path="/jobs/:id/apply"
            element={
              <ProtectedRoute
                allowedRoles={["candidate"]}
              >
                <ApplyJob />
              </ProtectedRoute>
            }
          />


          {/* ================================
              My Applications
          ================================= */}

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute
                allowedRoles={["candidate"]}
              >
                <MyApplications />
              </ProtectedRoute>
            }
          />


          {/* ================================
              Profile
          ================================= */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* ================================
              Resume
          ================================= */}

          <Route
            path="/resume"
            element={
              <ProtectedRoute
                allowedRoles={["candidate"]}
              >
                <Resume />
              </ProtectedRoute>
            }
          />


          {/* ================================
              Recruiter Dashboard
          ================================= */}

          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["recruiter"]}
              >
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />


          {/* ================================
              Create Job
          ================================= */}

          <Route
            path="/create-job"
            element={
              <ProtectedRoute
                allowedRoles={["recruiter"]}
              >
                <CreateJob />
              </ProtectedRoute>
            }
          />


          {/* ================================
              Edit Job
          ================================= */}

          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute
                allowedRoles={["recruiter"]}
              >
                <EditJob />
              </ProtectedRoute>
            }
          />


          {/* ================================
              Applicants
          ================================= */}

          <Route
            path="/applicants/:jobId"
            element={
              <ProtectedRoute
                allowedRoles={["recruiter"]}
              >
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

