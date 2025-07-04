import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "../api/authApi";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const getStoredUsers = () => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await register({ name: username, email, password });

      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-2 sm:px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded shadow-md w-full max-w-xs sm:max-w-md text-gray-900 dark:text-gray-100 transition-colors duration-300"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Signup</h2>
        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-center">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 dark:text-green-400 text-center">{success}</div>
        )}
        <label className="block mb-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">Username</label>
        <input
          type="text"
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 w-full mb-4 rounded text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors duration-300"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <label className="block mb-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">Email</label>
        <input
          type="email"
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 w-full mb-4 rounded text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors duration-300"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label className="block mb-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 w-full rounded pr-10 text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors duration-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword((show) => !show)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
            tabIndex={0}
            role="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-900 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-400 transition mb-4 text-sm sm:text-base"
        >
          Signup
        </button>
        <div className="text-center text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
