import { useState, useRef, useEffect } from "react";
import { useIssues } from "../contexts/IssuesContext";
import axios from "axios";

export default function IssueForm() {
  const [form, setForm] = useState({
    name: "",
    usn: "",
    branch: "",
    section: "",
    email: "",
    title: "",
    issue: "",
    photo: "", // Will store Cloudinary URL
  });
  const [errors, setErrors] = useState({});
  const [flash, setFlash] = useState("");
  const [showFlash, setShowFlash] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { addIssue } = useIssues();

  // ✅ Cloudinary config - update if needed
  const CLOUD_NAME = "dfencawwb";
  const UPLOAD_PRESET = "unsigned_present";

  // ✅ API base URL from .env
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      uploadToCloudinary(files[0]);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data
      );
      setForm((prev) => ({
        ...prev,
        photo: res.data.secure_url,
      }));
      setErrors((prev) => ({ ...prev, photo: undefined }));
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.message || "Image upload failed. Please try again.";
      setErrors((prev) => ({
        ...prev,
        photo: errorMsg,
      }));
    }
    setUploading(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Please enter your name.";
    if (!form.usn) newErrors.usn = "Please enter your USN.";
    if (!form.branch) newErrors.branch = "Please enter your branch.";
    if (!form.section) newErrors.section = "Please enter your section.";
    if (!form.email) newErrors.email = "Please enter a valid email address.";
    if (!form.title) newErrors.title = "Please enter an issue title.";
    if (!form.issue) newErrors.issue = "Please describe the issue.";
    if (!form.photo) newErrors.photo = "Please upload the image.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post(`${BASE_URL}/api/issues`, {
          ...form,
          date: new Date().toLocaleString(),
        });

        setFlash("Issue submitted!");
        setShowFlash(true);

        setForm({
          name: "",
          usn: "",
          branch: "",
          section: "",
          email: "",
          title: "",
          issue: "",
          photo: "",
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setTimeout(() => setShowFlash(false), 2700);
        setTimeout(() => setFlash(""), 3200);
      } catch (error) {
        setFlash("Failed to submit issue: " + (error.response?.data?.error || error.message));
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 2700);
        setTimeout(() => setFlash(""), 3200);
      }
    }
  };

  useEffect(() => {
    return () => {
      setFlash("");
      setShowFlash(false);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-[80vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-2 sm:px-4 md:px-8">
      {/* Flash Message */}
      {flash && (
        <div
          className={`
            fixed top-20 right-4 sm:right-8 z-50 flex items-center
            bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded shadow-lg font-semibold
            transition-all duration-500 ease-in-out
            ${showFlash
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-6 pointer-events-none"}
          `}
          role="alert"
          style={{ minWidth: "220px" }}
        >
          <svg
            className="w-5 h-5 mr-2 text-green-600 dark:text-green-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {flash}
        </div>
      )}

      <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-gray-800 rounded shadow p-4 sm:p-8 mt-8 transition-colors duration-300">
        <h3 className="mb-6 text-xl sm:text-2xl font-bold text-center text-blue-700 dark:text-blue-400">
          Report New Issue
        </h3>
        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm sm:text-base">Your Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`border p-2 w-full rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
              placeholder="Enter your full name"
              required
            />
            {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
          </div>
          {/* USN */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm sm:text-base">USN</label>
            <input
              type="text"
              name="usn"
              value={form.usn}
              onChange={handleChange}
              className={`border p-2 w-full rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base ${errors.usn ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
              placeholder="U25UV22T0430XX"
              required
            />
            {errors.usn && <div className="text-red-500 text-xs">{errors.usn}</div>}
          </div>
          {/* Branch and Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium text-sm sm:text-base">Branch</label>
              <input
                type="text"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className={`border p-2 w-full rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base ${errors.branch ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                placeholder="CSE / ECE / ME etc."
                required
              />
              {errors.branch && <div className="text-red-500 text-xs">{errors.branch}</div>}
            </div>
            <div className="sm:w-28">
              <label className="block mb-1 font-medium text-sm sm:text-base">Section</label>
              <input
                type="text"
                name="section"
                value={form.section}
                onChange={handleChange}
                className={`border p-2 w-full rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base ${errors.section ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
                placeholder="A / B / C"
                required
              />
              {errors.section && <div className="text-red-500 text-xs">{errors.section}</div>}
            </div>
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm sm:text-base">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`border p-2 w-full rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
              placeholder="example@student.edu"
              required
            />
            {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
          </div>
          {/* Title */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm sm:text-base">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`border p-2 w-full rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base ${errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
              placeholder="Short title for the issue"
              required
            />
            {errors.title && <div className="text-red-500 text-xs">{errors.title}</div>}
          </div>
          {/* Issue */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm sm:text-base">Issue Summary</label>
            <input
              type="text"
              name="issue"
              value={form.issue}
              onChange={handleChange}
              className={`border p-2 w-full rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base ${errors.issue ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
              placeholder="Eg: Broken bench near Block C"
              required
            />
            {errors.issue && <div className="text-red-500 text-xs">{errors.issue}</div>}
          </div>
          {/* Photo */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm sm:text-base">Photo</label>
            <input
              type="file"
              name="photo"
              ref={fileInputRef}
              onChange={handleChange}
              className={`border p-2 w-full rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base ${errors.photo ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
              required
              accept="image/*"
              disabled={uploading}
            />
            {uploading && <div className="text-blue-500 dark:text-blue-300 text-xs mt-2">Uploading image...</div>}
            {form.photo && !uploading && (
              <img
                src={form.photo}
                alt="Preview"
                className="w-full max-w-xs h-28 object-cover mt-2 rounded bg-gray-100 dark:bg-gray-700 mx-auto"
              />
            )}
            {errors.photo && <div className="text-red-500 text-xs">{errors.photo}</div>}
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-900 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-400 transition mt-2"
            disabled={uploading}
          >
            Report Issue
          </button>
        </form>
      </div>
    </div>
  );
}
