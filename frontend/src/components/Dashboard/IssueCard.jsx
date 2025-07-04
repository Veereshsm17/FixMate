import { motion } from "framer-motion";

export default function IssueCard({ issue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded shadow p-4 mb-4 border-l-4 border-blue-500"
    >
      <h3 className="text-lg font-semibold text-blue-700">{issue.title}</h3>
      <p className="text-gray-700 mb-2">{issue.description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <span>Status: <span className="font-medium">{issue.status}</span></span>
        <span>Created: {new Date(issue.createdAt).toLocaleString()}</span>
        <span>
          By: {issue.createdBy?.name || "Unknown"}
        </span>
      </div>
      {issue.comments && issue.comments.length > 0 && (
        <div className="mt-3">
          <div className="font-semibold text-blue-600 mb-1">Comments:</div>
          <ul className="pl-4 list-disc">
            {issue.comments.map((c, i) => (
              <li key={i}>
                <span className="font-medium">{c.user?.name || "User"}:</span> {c.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
