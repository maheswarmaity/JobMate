import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedTest from "./pages/ProtectedTest";
import ProtectedRoute from "./components/ProtectedRoute";
import CandidateDashboard from "./pages/CandidateDashboard";
import { AuthProvider } from "./context/AuthContext";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav>
          <Link to="/login">Login</Link>
          {" | "}
          <Link to="/register">Register</Link>
          {" | "}
          <Link to="/protected">Protected</Link>
          {" | "}
          <Link to="/candidate-dashboard">Candidate Dashboard</Link>
          {" | "}
          <Link to="/jobs">Jobs</Link>
          {" | "}
          <Link to="/my-applications">My Applications</Link>
          {" | "}
          <Link to="/profile">Profile</Link>
          {" | "}
          <Link to="/resume">Resume</Link>
          {" | "}
          <Link to="/recruiter-dashboard">Recruiter Dashboard</Link>
          {" | "}
          <Link to="/create-job">Create Job</Link>
        </nav>

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
              <ProtectedRoute>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/jobs" element={<JobList />} />

          <Route
            path="/jobs/:id"
            element={<JobDetails />}
          />

          <Route
            path="/jobs/:id/apply"
            element={
              <ProtectedRoute>
                <ApplyJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute>
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
              <ProtectedRoute>
                <Resume />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter-dashboard"
            element={
             <ProtectedRoute>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-job"
            element={
              <ProtectedRoute>
                <CreateJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute>
                <EditJob />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
