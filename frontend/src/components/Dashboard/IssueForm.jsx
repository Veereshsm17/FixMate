import { useState } from "react";
import { createIssue } from "../../api/issueApi";
import { useAuth } from "../../contexts/AuthContext";

export default function IssueForm({ onIssueCreated }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createIssue(form, user.token);
      setForm({ title: "", description: "" });
      onIssueCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create issue");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded shadow p-6 mb-6 animate-fade-in"
    >
      <h2 className="text-xl font-bold mb-4 text-blue-600">Report a New Issue</h2>
      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">
          {error}
        </div>
      )}
      <input
        name="title"
        type="text"
        placeholder="Title"
        className="w-full mb-3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={form.description}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold"
      >
        {loading ? "Submitting..." : "Submit Issue"}
      </button>
    </form>
  );
}
