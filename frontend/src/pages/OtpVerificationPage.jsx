import React, { useState } from "react";

export default function OtpVerificationPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP.");
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.message || "Server error.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid or expired OTP.");
      setMessage("OTP verified! You may now reset your password.");
      setStep(3);
    } catch (err) {
      setError(err.message || "Server error.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");
      setMessage("Password reset successful! You may now log in.");
    } catch (err) {
      setError(err.message || "Server error.");
    }
    setLoading(false);
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-xs sm:max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-8 mt-8 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Reset Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label className="block mb-2 text-gray-900 dark:text-gray-300 text-sm sm:text-base">
              Enter your email
            </label>
            <input
              type="email"
              className="w-full p-2 sm:p-3 mb-4 border border-gray-300 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <label className="block mb-2 text-gray-900 dark:text-gray-300 text-sm sm:text-base">
              Enter the 6-digit OTP sent to{" "}
              <span className="font-semibold">{email}</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full p-2 sm:p-3 mb-4 border border-gray-300 rounded text-center bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 sm:py-3 rounded disabled:opacity-50"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              className="mt-2 text-blue-600 hover:underline text-xs sm:text-sm dark:text-blue-400"
              onClick={handleSendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label className="block mb-2 text-gray-900 dark:text-gray-300 text-sm sm:text-base">
              Enter new password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 sm:p-3 mb-4 border border-gray-300 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 pr-12 text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 011.175-4.875M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 sm:py-3 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <p className="text-green-600 dark:text-green-400 text-center mt-4 text-sm sm:text-base">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-center mt-4 text-sm sm:text-base">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
