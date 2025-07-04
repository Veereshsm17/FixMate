import React, { createContext, useContext, useState, useEffect } from "react";

const IssuesContext = createContext();

export function IssuesProvider({ children }) {
  const [issues, setIssues] = useState(() => {
    const stored = localStorage.getItem("reportedIssues");
    if (stored) {
      // Ensure every issue has upvotes array and a unique _id
      return JSON.parse(stored).map(issue =>
        ({
          ...issue,
          upvotes: Array.isArray(issue.upvotes) ? issue.upvotes : [],
          _id: issue._id || issue.id || Date.now().toString() + Math.random().toString(36).slice(2)
        })
      );
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("reportedIssues", JSON.stringify(issues));
  }, [issues]);

  // Add a new issue (ensure upvotes array and unique _id)
  const addIssue = (issue) =>
    setIssues((prev) => [
      ...prev,
      {
        ...issue,
        upvotes: [],
        _id: Date.now().toString() + Math.random().toString(36).slice(2),
      },
    ]);

  // Toggle upvote for an issue (add or remove upvote for user)
  const upvoteIssue = (issueId, userId, alreadyUpvoted = false) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue._id === issueId || issue.id === issueId) {
          const upvotes = Array.isArray(issue.upvotes) ? issue.upvotes : [];
          return {
            ...issue,
            upvotes: alreadyUpvoted
              ? upvotes.filter((id) => id !== userId)
              : [...upvotes, userId],
          };
        }
        return issue;
      })
    );
  };

  // === The only addition: setIssues is now in the context value ===
  return (
    <IssuesContext.Provider value={{ issues, setIssues, addIssue, upvoteIssue }}>
      {children}
    </IssuesContext.Provider>
  );
}

export function useIssues() {
  return useContext(IssuesContext);
}
