import React from "react";

// DashboardCard Component
// Shows a card with icon + title + description
// Also supports dark mode, click action, and optional count
const DashboardCard = ({ icon, title, description,count, onClick, isDarkMode }) => (
  <div
   // Main Card Container
  // - onClick triggers parent function (if provided)
// - Styling changes based on dark/light theme
    onClick={onClick}
    className={`p-10 m-2 rounded-xl shadow-md max-w-sm w-11/12 text-left transition duration-200
      ${
        isDarkMode
          ? "bg-gray-800 text-white hover:shadow-lg hover:bg-gray-700"
          : "bg-white text-gray-900 hover:shadow-lg hover:bg-gray-100"
      }`}
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
     {/* Title Section: Displays icon + title together */}
    <h3 className="mb-2 text-xl font-semibold flex items-center gap-2">
      {icon} {title}
    </h3>
       {/* Description text (color depends on mode) */}
    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
      {description}
    </p>
  {/* show count */}
      {count !== undefined && (
        <p className="mt-2 font-semibold text-blue-600">Total: {count}</p>
      )}

  </div>
);

export default DashboardCard;
