// src/components/Shared/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="font-bold text-lg">IssueTracker</span>
        <span className="ml-2 text-sm text-gray-400">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
