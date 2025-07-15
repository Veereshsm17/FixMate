// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Moon, Sun, Menu, X } from "lucide-react";

// ✅ Use API base URL from .env (or fallback to localhost)
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-300">
      {/* Navbar */}
      <nav className="w-full flex items-center px-4 md:px-8 py-4 bg-white dark:bg-gray-800 shadow-md relative">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          FixMate
        </Link>

        {/* Hi, username (centered on mobile, right on desktop) */}
        {user && (
          <span className="flex-1 text-center md:text-right text-sm font-medium text-gray-700 dark:text-gray-100 hidden sm:block">
            Hi, {user.username}
          </span>
        )}

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 ml-4">
          <Link
            to="/issueform"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Raise Issue
          </Link>
          <Link to="/reported-issues" className="text-sm hover:underline">
            Reported Issues
          </Link>
          <Link to="/resolved-issues" className="text-sm hover:underline">
            Resolved Issues
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-600"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden ml-2 p-2 rounded focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 py-4 flex flex-col gap-4 shadow-md z-50">
          {user && (
            <div className="text-gray-700 dark:text-gray-100 font-medium mb-2">
              Hi, {user.username}
            </div>
          )}
          <Link
            to="/issueform"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Raise Issue
          </Link>
          <Link
            to="/reported-issues"
            className="text-sm hover:underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            Reported Issues
          </Link>
          <Link
            to="/resolved-issues"
            className="text-sm hover:underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            Resolved Issues
          </Link>
          <button
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}

      {/* Content */}
      <main className="max-w-3xl mx-auto p-4 sm:p-8 text-gray-900 dark:text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Pending Issues</h1>
        <p>No pending issues found.</p>
      </main>
    </div>
  );
};

export default Dashboard;
