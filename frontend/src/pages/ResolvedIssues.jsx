import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// ✅ Define API URL at top:
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function ResolvedIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${API_URL}/issues?status=resolved`, {
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${yourToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIssues(Array.isArray(data) ? data : data.issues || []);
        setLoading(false);
      })
      .catch((err) => {
        setIssues([]);
        setLoading(false);
      });
  }, []);

  const getImageSrc = (photo) => {
    if (!photo) return "https://via.placeholder.com/400x250?text=No+Image";
    if (typeof photo === "string") return photo;
    if (photo instanceof File || photo instanceof Blob) {
      return URL.createObjectURL(photo);
    }
    return "https://via.placeholder.com/400x250?text=No+Image";
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/resolved-issues/${issueId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (res.ok) {
        setIssues((prev) =>
          prev.filter(
            (i) =>
              (typeof i._id === "object" && i._id.$oid
                ? i._id.$oid
                : i._id || i.id) !== issueId
          )
        );
      } else {
        alert("Failed to delete issue.");
      }
    } catch (err) {
      alert("Failed to delete issue.");
    }
  };

  return (
    <div className="min-h-[60vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-2 sm:px-4 md:px-8 py-6 sm:py-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-gray-100">
        Resolved Issues
      </h2>
      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      ) : issues.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No resolved issues found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => {
            const issueId =
              typeof issue._id === "object" && issue._id.$oid
                ? issue._id.$oid
                : issue._id || issue.id;
            return (
              <div
                key={issueId}
                className="block"
                style={{ textDecoration: "none" }}
              >
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition cursor-pointer h-full">
                  <img
                    src={getImageSrc(issue.photo)}
                    alt="Issue"
                    className="w-full h-40 sm:h-48 md:h-56 object-cover bg-gray-100 dark:bg-gray-700"
                  />
                  <div className="flex-1 p-4 flex flex-col text-gray-900 dark:text-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                      <h5 className="text-lg font-semibold break-words">
                        {issue.title || issue.name || "Untitled Issue"}
                      </h5>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase mt-1 sm:mt-0 ml-0 sm:ml-2">
                        Resolved
                      </span>
                    </div>
                    <p className="mb-3 sm:mb-4 text-gray-700 dark:text-gray-300 break-words">
                      <span className="font-medium">Description:</span>{" "}
                      {issue.description || issue.issue || "No description"}
                    </p>
                    <div className="mb-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {issue.createdBy && (
                        <div>
                          <span className="font-medium">Reported By:</span>{" "}
                          {issue.createdBy.name || "Unknown"} (
                          {issue.createdBy.email || "No email"})
                        </div>
                      )}
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
                      {issue.branch && (
                        <div>
                          <span className="font-medium">Branch:</span> {issue.branch}
                        </div>
                      )}
                      {issue.section && (
                        <div>
                          <span className="font-medium">Section:</span> {issue.section}
                        </div>
                      )}
                    </div>
                    {user?.email === "smveeresh22@gmail.com" && (
                      <button
                        onClick={() => handleDelete(issueId)}
                        className="mt-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 transition self-end"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
