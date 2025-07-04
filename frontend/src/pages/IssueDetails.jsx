import React from "react";
import { useParams } from "react-router-dom";
import { useIssues } from "../contexts/IssuesContext";
import { useAuth } from "../contexts/AuthContext";
import { FaThumbsUp } from "react-icons/fa";

const getImageSrc = (photo) => {
  if (!photo) return "https://via.placeholder.com/400x250?text=No+Image";
  if (typeof photo === "string") return photo;
  if (photo instanceof File || photo instanceof Blob) {
    return URL.createObjectURL(photo);
  }
  return "https://via.placeholder.com/400x250?text=No+Image";
};

export default function IssueDetails() {
  const { id } = useParams();
  const { issues, upvoteIssue } = useIssues();
  const { user } = useAuth();

  React.useEffect(() => {
    console.log("Route param id:", id);
    console.log("All issue IDs:", issues.map((i) => i._id || i.id));
  }, [id, issues]);

  const issue = issues.find((i) => String(i._id || i.id) === String(id));

  if (!issue) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Issue not found for id: <b>{id}</b>
      </div>
    );
  }

  const upvotes = issue.upvotes || [];
  const userId = user?.email;
  const hasUpvoted = userId && upvotes.includes(userId);
  const isUrgent = upvotes.length >= 15;

  const handleUpvote = () => {
    if (!user?.email) {
      alert("Please login to upvote");
      return;
    }
    upvoteIssue(issue._id || issue.id, user.email, hasUpvoted);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-white dark:bg-gray-800 rounded shadow-md p-4 sm:p-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
        <div className="flex flex-col lg:flex-row gap-6">
          <img
            src={getImageSrc(issue.photo)}
            alt="Issue"
            className="w-full h-52 sm:h-56 lg:w-80 object-cover rounded bg-gray-100 dark:bg-gray-700"
          />
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 break-words">{issue.name}</h2>
            <div className="mb-2">
              <span className="font-medium">Issue:</span> {issue.issue}
            </div>
            <div className="mb-2">
              <span className="font-medium">Status:</span>{" "}
              <span className="inline-block px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-700 dark:text-gray-200">
                {issue.status}
              </span>
              {isUrgent && (
                <span className="ml-3 px-2 py-1 bg-red-700 text-white text-xs font-bold rounded">
                  Urgent Issue
                </span>
              )}
            </div>
            {issue.date && (
              <div className="mb-2">
                <span className="font-medium">Date:</span> {issue.date}
              </div>
            )}
            {issue.usn && (
              <div className="mb-2">
                <span className="font-medium">USN:</span> {issue.usn}
              </div>
            )}
            {issue.branch && (
              <div className="mb-2">
                <span className="font-medium">Branch:</span> {issue.branch}
                {issue.section ? ` - ${issue.section}` : ""}
              </div>
            )}
            {issue.email && (
              <div className="mb-2">
                <span className="font-medium">Email:</span> {issue.email}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-start sm:items-center flex-wrap gap-3 mt-4">
              <button
                className={`px-3 py-1 rounded flex items-center gap-1 text-sm font-semibold transition ${
                  hasUpvoted
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                    : "bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-blue-400"
                }`}
                onClick={handleUpvote}
              >
                <FaThumbsUp className={hasUpvoted ? "text-blue-600" : ""} />
                {hasUpvoted ? "Remove Up Vote" : "Up Vote"}
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {upvotes.length} Up Votes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
