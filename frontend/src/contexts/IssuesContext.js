import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const IssuesContext = createContext();
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"; // updated

export function IssuesProvider({ children }) {
  const [issues, setIssues] = useState([]);

  // Fetch issues from backend on mount
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/issues`); // updated
        setIssues(res.data || []);
      } catch (err) {
        console.error("Failed to load issues from server:", err.message);
      }
    };

    fetchIssues();
  }, []);

  // Add a new issue via backend
  const addIssue = async (issue) => {
    try {
      const res = await axios.post(`${BASE_URL}/issues`, issue); // updated
      setIssues((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add issue:", err.message);
    }
  };

  // Upvote or remove upvote
  const upvoteIssue = async (issueId, userEmail, alreadyUpvoted) => {
    try {
      const res = await axios.post(`${BASE_URL}/issues/upvote`, { // updated
        issueId,
        userEmail,
        hasUpvoted: alreadyUpvoted,
      });

      const updated = res.data;
      setIssues((prev) =>
        prev.map((issue) =>
          (issue._id || issue.id) === issueId ? updated : issue
        )
      );
    } catch (err) {
      console.error("Upvote failed:", err.message);
    }
  };

  return (
    <IssuesContext.Provider value={{ issues, setIssues, addIssue, upvoteIssue }}>
      {children}
    </IssuesContext.Provider>
  );
}

export function useIssues() {
  return useContext(IssuesContext);
}
