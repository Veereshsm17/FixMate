import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { IssuesProvider } from "./contexts/IssuesContext";
import Navbar from "./components/Shared/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ReportedIssues from "./pages/ReportedIssues";
import ResolvedIssues from "./pages/ResolvedIssues";
import IssueForm from "./pages/IssueForm";
import IssueDetails from "./pages/IssueDetails";
import AdminPanel from "./pages/AdminPanel";
import Footer from "./components/Shared/Footer";
import OtpVerificationPage from "./pages/OtpVerificationPage"; // <-- Added import

import './styles/tailwind.css';
import "./styles/custom.css";

// PrivateRoute component to protect routes
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// AdminRoute component to protect admin-only routes
function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === "admin" ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <IssuesProvider>
        <Router>
          <div className={`min-h-screen flex flex-col transition-colors duration-300 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}>

            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="/reported-issues" element={<ReportedIssues />} />
                <Route path="/resolved-issues" element={<ResolvedIssues />} />
                <Route
                  path="/issueform"
                  element={
                    <PrivateRoute>
                      <IssueForm />
                    </PrivateRoute>
                  }
                />
                <Route path="/issues/:id" element={<IssueDetails />} />
                
                {/* === ADMIN PANEL ROUTE (added) === */}
                <Route
                  path="/admin-panel"
                  element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  }
                />
                {/* ================================== */}

                {/* === OTP Verification Route (added) === */}
                <Route path="/otp-verification" element={<OtpVerificationPage />} />
                {/* ====================================== */}

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </IssuesProvider>
    </AuthProvider>
  );
}
