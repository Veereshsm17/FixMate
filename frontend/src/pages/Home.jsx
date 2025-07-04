import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/issueform");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="
        min-h-screen w-full
        bg-gradient-to-br from-blue-100 to-blue-300
        text-gray-900 dark:text-gray-100
        transition-colors duration-300
        flex items-center justify-center
        px-2 sm:px-4 md:px-8
      "
    >
      <div className="
        w-full max-w-lg sm:max-w-xl md:max-w-2xl
        bg-white dark:bg-gray-800
        rounded-xl shadow-lg
        p-4 sm:p-8
        flex flex-col items-center text-center
        transition-colors duration-300
      ">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4">
          Welcome to{" "}
          <span className="text-blue-600 dark:text-blue-400">FixMate</span>
        </h1>

        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-blue-800 dark:text-gray-300 mb-6 sm:mb-8">
          Your modern platform for reporting and resolving issues with ease and efficiency.
        </p>

        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full justify-center">
          <button
            onClick={handleGetStarted}
            className="px-4 sm:px-6 py-2 w-full xs:w-auto rounded-lg bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-900 font-semibold shadow hover:bg-blue-700 dark:hover:bg-blue-400 transition"
          >
            Get Started
          </button>
          <a
            href="/reported-issues"
            className="px-4 sm:px-6 py-2 w-full xs:w-auto rounded-lg bg-white text-blue-600 dark:bg-gray-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-100 dark:hover:bg-gray-600 transition"
          >
            View Issues
          </a>
        </div>
      </div>
    </div>
  );
}
