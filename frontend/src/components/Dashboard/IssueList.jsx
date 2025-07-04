import { useEffect, useState } from "react";
import { getIssues } from "../../api/issueApi";
import { useAuth } from "../../contexts/AuthContext";
import IssueCard from "./IssueCard";

export default function IssueList({ refresh }) {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getIssues(user.token)
      .then((data) => {
        if (mounted) setIssues(data);
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [user.token, refresh]);

  if (loading) {
    return <div className="text-center text-blue-600 py-6">Loading issues...</div>;
  }

  if (issues.length === 0) {
    return <div className="text-center text-gray-500 py-6">No issues found.</div>;
  }

  return (
    <div>
      {issues.map((issue) => (
        <IssueCard key={issue._id} issue={issue} />
      ))}
    </div>
  );
}
