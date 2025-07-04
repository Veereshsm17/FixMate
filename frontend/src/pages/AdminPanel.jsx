// src/pages/AdminPanel.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getPendingIssuesAdmin,
  resolveIssueAdmin,
  deleteResolvedIssueAdmin,
} from "../api/issueApi";

// Helper components
const Loading = () => <div>Loading issues...</div>;
const ErrorMsg = ({ msg }) => <div className="text-red-600">{msg}</div>;

// Helper function: validate MongoDB ObjectId
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [pendingIssues, setPendingIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch pending issues from backend
  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    getPendingIssuesAdmin(user.token)
      .then((data) => {
        // Filter out invalid IDs
        const filtered = Array.isArray(data)
          ? data.filter((issue) => isValidObjectId(issue._id))
          : [];
        setPendingIssues(filtered);
        setError("");
        if (filtered.length !== data.length) {
          setError("Some issues were filtered out due to invalid IDs.");
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.error || err.message || "Failed to fetch issues"
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Mark an issue as resolved
  const resolveIssue = async (issueId) => {
    if (!window.confirm("Mark this issue as resolved?")) return;
    try {
      await resolveIssueAdmin(issueId, user.token);
      setPendingIssues((prev) => prev.filter((issue) => issue._id !== issueId));
    } catch (err) {
      alert(
        err.response?.data?.error || err.message || "Failed to resolve issue"
      );
    }
  };

  // Delete a resolved issue
  const deleteResolvedIssue = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await deleteResolvedIssueAdmin(issueId, user.token);
      setPendingIssues((prev) => prev.filter((issue) => issue._id !== issueId));
    } catch (err) {
      alert(
        err.response?.data?.error || err.message || "Failed to delete issue"
      );
    }
  };

  // UI rendering
  if (!user || user.role !== "admin") {
    return (
      <div className="text-red-600 p-8 text-center">
        Only admins can access this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      {/* Responsive Navbar */}
      <nav className="w-full bg-white dark:bg-gray-800 shadow flex items-center px-4 py-3 md:px-8">
        {/* Logo */}
        <div className="text-blue-700 dark:text-blue-300 font-extrabold text-xl tracking-wide">
          FixMate
        </div>
        {/* Hi, username */}
        <div className="ml-auto md:ml-8 flex-1 text-center md:text-right text-gray-700 dark:text-gray-100 font-medium hidden md:block">
          Hi, {user?.username || user?.name || "Admin"}
        </div>
        {/* Hamburger for small screens */}
        <div className="ml-auto md:hidden">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-gray-700 dark:text-gray-100 focus:outline-none"
            aria-label="Open menu"
          >
            {/* Hamburger Icon */}
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg px-4 py-3">
          <div className="text-gray-700 dark:text-gray-100 font-medium mb-2">
            Hi, {user?.username || user?.name || "Admin"}
          </div>
          <button
            onClick={logout}
            className="block w-full text-left py-2 px-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-300 font-semibold"
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="
        w-full max-w-2xl mx-auto
        mt-6 md:mt-10
        p-3 sm:p-5 md:p-8
        bg-white dark:bg-gray-800
        rounded-lg shadow
        transition
      ">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-5 text-blue-700 dark:text-blue-300">
          Admin Panel: Pending Issues
        </h2>
        {loading && <Loading />}
        {error && <ErrorMsg msg={error} />}
        {!loading && pendingIssues.length === 0 && (
          <div className="text-green-600 dark:text-green-400">No pending issues! 🎉</div>
        )}
        <ul className="list-none p-0">
          {pendingIssues.map((issue) => (
            <li
              key={issue._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-900 transition word-break break-words"
            >
              <div>
                <strong className="text-gray-900 dark:text-white">{issue.name}</strong> ({issue.email})<br />
                <span className="text-gray-600 dark:text-gray-300">{issue.issue}</span>
              </div>
              <div className="mt-2 text-sm">
                Status: <b className="text-blue-700 dark:text-blue-300">{issue.status}</b>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => resolveIssue(issue._id)}
                  className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded transition"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => deleteResolvedIssue(issue._id)}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
