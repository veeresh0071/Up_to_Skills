import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, AlertCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Component: Displays all programs assigned to the logged-in mentor
const AssignedPrograms = ({ isDarkMode, setIsDarkMode }) => {
  // List of assigned programs
  const [programs, setPrograms] = useState([]);

  // UI state management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assigned programs when component loads
  useEffect(() => {
    let isMounted = true;

    const fetchAssignedPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get logged-in user from localStorage
        const userJson = localStorage.getItem("user");
        if (!userJson) {
          if (isMounted) setError("User information not found. Please log in again.");
          return;
        }

        let mentorId;
        try {
          const user = JSON.parse(userJson);
          mentorId = user?.id;
        } catch (parseErr) {
          console.error("Error parsing user from localStorage:", parseErr);
          if (isMounted) setError("User information is invalid. Please log in again.");
          return;
        }

        if (!mentorId) {
          if (isMounted) setError("Mentor ID not found. Please log in again.");
          return;
        }

        // Optional token header (endpoint currently works without it, but keeps requests consistent)
        const token = localStorage.getItem("token");
        const axiosConfig = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined;

        const response = await axios.get(
          `http://localhost:5000/api/assigned-programs/mentor/${mentorId}`,
          axiosConfig
        );

        if (!isMounted) return;

        if (response.data?.success && Array.isArray(response.data?.data)) {
          setPrograms(response.data.data);
        } else {
          setPrograms([]);
          setError("Failed to load assigned programs.");
        }
      } catch (err) {
        console.error("Error fetching assigned programs:", err);
        if (!isMounted) return;
        setPrograms([]);
        setError(
          err.response?.data?.message ||
            "Failed to load assigned programs. Please try again."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAssignedPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className={`mt-14 flex min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar (Left Navigation) */}
      <Sidebar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        <div
          className={`flex-1 p-8 transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          {/* Page Title Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <h1 className="text-4xl font-extrabold">My Assigned Programs</h1>
            </div>

            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              View all the programs and courses assigned to you for mentoring
            </p>
          </div>

          {/* 🔄 Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-4 text-lg">Loading programs...</span>
            </div>
          )}

          {/* ❌ Error Message */}
          {error && !loading && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg mb-6 ${
                isDarkMode
                  ? "bg-red-900/20 border border-red-700 text-red-300"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* 🕳️ Empty State (No Programs Found) */}
          {!loading && !error && programs.length === 0 && (
            <div
              className={`flex flex-col items-center justify-center py-16 rounded-lg ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <BookOpen className="w-16 h-16 mb-4 opacity-30" />
              <h3 className="text-2xl font-semibold mb-2">No Programs Yet</h3>
              <p
                className={`text-center max-w-md ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                You don't have any programs assigned yet. Contact your admin to get started.
              </p>
            </div>
          )}

          {/* 🟦 Programs Grid */}
          {!loading && !error && programs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className={`p-6 rounded-lg shadow-md transition-all hover:shadow-lg ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-750"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {/* Program Title Row */}
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <h3 className="text-xl font-bold break-words">
                      {program.program_name}
                    </h3>
                  </div>

                  {/* Program Description (if available) */}
                  {program.program_description && (
                    <p
                      className={`mb-4 text-sm line-clamp-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {program.program_description}
                    </p>
                  )}

                  {/* Program Metadata */}
                  <div
                    className={`pt-4 border-t ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="text-xs space-y-1">
                      {/* Course ID */}
                      <p
                        className={
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }
                      >
                        <strong>Course ID:</strong> {program.course_id}
                      </p>

                      {/* Assigned On Date */}
                      <p
                        className={
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }
                      >
                        <strong>Assigned On:</strong>{" "}
                        {new Date(program.assigned_on).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 📌 Program Count Display */}
          {!loading && !error && programs.length > 0 && (
            <div
              className={`mt-8 p-4 rounded-lg text-center ${
                isDarkMode ? "bg-gray-800" : "bg-blue-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-blue-700"
                }`}
              >
                You have <strong>{programs.length}</strong> program(s) assigned to you
              </p>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default AssignedPrograms;
