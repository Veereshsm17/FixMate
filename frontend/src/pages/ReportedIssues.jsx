import React, { useState, useEffect } from "react";
import { useIssues } from "../contexts/IssuesContext";
import { useAuth } from "../contexts/AuthContext";
import { FaThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ReportedIssues() {
  const { issues, setIssues, upvoteIssue } = useIssues();
  const { user } = useAuth();
  const [showLoginMsg, setShowLoginMsg] = useState(false);

 useEffect(() => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  async function fetchIssues() {
    try {
      const res = await axios.get(`${BASE_URL}/api/issues`);
      setIssues(res.data);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      setIssues([]);
    }
  }

  fetchIssues();
}, [setIssues]);

  const pendingIssues = issues.filter(issue => issue.status !== "resolved");

  const getBadgeClass = (status) => {
    if (status === "Pending") return "bg-red-500";
    if (status === "In Progress") return "bg-yellow-400 text-black";
    if (status === "Resolved") return "bg-green-500";
    return "bg-gray-400";
  };

  const getImageSrc = (photo) => {
    if (!photo) return "https://via.placeholder.com/400x250?text=No+Image";
    if (typeof photo === "string") return photo;
    if (photo instanceof File || photo instanceof Blob) {
      return URL.createObjectURL(photo);
    }
    return "https://via.placeholder.com/400x250?text=No+Image";
  };

  const handleUpvote = (issue, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.email) {
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 3000);
      return;
    }
    upvoteIssue(
      issue._id || issue.id,
      user.email,
      issue.upvotes?.includes(user.email)
    );
  };

  const handleResolve = async (issue, e) => {
    e.preventDefault();
    e.stopPropagation();
    const issueId =
      typeof issue._id === "object" && issue._id.$oid
        ? issue._id.$oid
        : issue._id || issue.id;

    try {
      const res = await fetch(`/api/admin/resolve-issue/${issueId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.ok) {
        const updatedIssue = await res.json();
        setIssues((prev) =>
          prev.filter((i) => (i._id || i.id) !== (issue._id || issue.id))
        );
      } else {
        let errorMsg = "Failed to resolve issue.";
        try {
          const errorData = await res.json();
          if (errorData && (errorData.error || errorData.message)) {
            errorMsg = errorData.error || errorData.message;
          }
        } catch (jsonErr) {}
        alert(errorMsg);
      }
    } catch (err) {
      alert("Failed to resolve issue (network or CORS error).");
    }
  };

  const handleDelete = async (issue, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await fetch(`/api/admin/resolved-issues/${issue._id || issue.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setIssues((prev) =>
        prev.filter((i) => (i._id || i.id) !== (issue._id || issue.id))
      );
    } catch (err) {
      alert("Failed to delete issue.");
    }
  };

  const getRoutingId = (issue) => issue._id || issue.id;
  const getReactKey = (issue, idx) => issue._id || issue.id || issue.usn || idx;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-6 sm:py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-gray-100">
        Pending Issues
      </h2>
      {showLoginMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded shadow-lg z-50 transition">
          Please login to upvote
        </div>
      )}
      {pendingIssues.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No pending issues found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pendingIssues.map((issue, idx) => {
            const upvotes = issue.upvotes || [];
            const userId = user?.email;
            const hasUpvoted = userId && upvotes.includes(userId);
            const isUrgent = upvotes.length >= 15;
            const routingId = getRoutingId(issue);
            const reactKey = getReactKey(issue, idx);

            if (!routingId) return null;

            return (
              <Link
                to={`/issues/${routingId}`}
                key={reactKey}
                className="block"
                style={{ textDecoration: "none" }}
              >
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition h-full flex flex-col cursor-pointer">
                  <img
                    src={getImageSrc(issue.photo)}
                    alt="Issue"
                    className="w-full h-40 sm:h-48 md:h-56 object-cover bg-gray-100 dark:bg-gray-700"
                  />
                  <div className="flex-1 p-4 flex flex-col text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                      <h5 className="text-lg font-semibold break-words">{issue.name}</h5>
                      {isUrgent && (
                        <span className="mt-1 sm:mt-0 ml-0 sm:ml-2 px-2 py-1 bg-red-700 text-white text-xs font-bold rounded">
                          Urgent Issue
                        </span>
                      )}
                    </div>
                    <p className="mb-3 sm:mb-4 text-gray-700 dark:text-gray-300 break-words">
                      <span className="font-medium">Issue:</span> {issue.issue}
                    </p>
                    <div className="mb-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {issue.date && (
                        <div>
                          <span className="font-medium">Date:</span> {issue.date}
                        </div>
                      )}
                      {issue.usn && (
                        <div>
                          <span className="font-medium">USN:</span> {issue.usn}
                        </div>
                      )}
                      {issue.branch && issue.section && (
                        <div>
                          <span className="font-medium">Branch:</span> {issue.branch} - {issue.section}
                        </div>
                      )}
                      {issue.email && (
                        <div>
                          <span className="font-medium">Email:</span> {issue.email}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getBadgeClass(
                          issue.status
                        )} text-white`}
                      >
                        {issue.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          className={`px-2 py-1 rounded ${
                            hasUpvoted
                              ? "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                              : "bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-blue-400"
                          } text-xs font-semibold flex items-center gap-1 transition`}
                          onClick={(e) => handleUpvote(issue, e)}
                        >
                          <FaThumbsUp className={hasUpvoted ? "text-blue-600" : ""} />
                          {hasUpvoted ? "Remove Upvote" : "Upvote"}
                        </button>
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          {upvotes.length} Upvotes
                        </span>
                      </div>
                    </div>
                    {user?.email === "smveeresh22@gmail.com" && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        {issue.status !== "Resolved" && (
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700 transition"
                            onClick={(e) => handleResolve(issue, e)}
                          >
                            Mark as Resolved
                          </button>
                        )}
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 transition"
                          onClick={(e) => handleDelete(issue, e)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
