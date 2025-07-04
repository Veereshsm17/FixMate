import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DarkModeToggle from "./DarkModeToggle"; // <-- Add this import

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handler for FixMate logo click
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-8 py-4 relative">
      {/* Left: FixMate logo (clickable) */}
      <div>
        <Link
          to="/"
          onClick={handleLogoClick}
          className="font-extrabold text-2xl text-blue-700 tracking-wider cursor-pointer"
        >
          FixMate
        </Link>
      </div>
      {/* Right: Navigation */}
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="flex items-center gap-2 text-blue-700 font-semibold">
              <span role="img" aria-label="wave">👋</span>
              Hi, {user.username || user.name}
            </span>
            <Link to="/issueform" className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
              Raise Issue
            </Link>
            <Link to="/reported-issues" className="text-gray-700 hover:underline">
              Reported Issues
            </Link>
            <Link to="/resolved-issues" className="text-gray-700 hover:underline">
              Resolved Issues
            </Link>
            <button
              onClick={logout}
              className="text-red-500 underline ml-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/reported-issues" className="text-gray-700 hover:underline">
              Reported Issues
            </Link>
            <Link to="/resolved-issues" className="text-gray-700 hover:underline">
              Resolved Issues
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </>
        )}
        <DarkModeToggle /> {/* <-- Add this line at the end of the nav */}
      </div>
    </nav>
  );
}
