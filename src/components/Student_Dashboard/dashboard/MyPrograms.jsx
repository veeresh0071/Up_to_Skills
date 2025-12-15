import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MyPrograms = () => {
  // Sidebar open/close state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Programs data state
  const [programs, setPrograms] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state for API or authentication issues
  const [error, setError] = useState("");

  // Get student/user ID from localStorage
  const studentId =
    localStorage.getItem("id") ||
    localStorage.getItem("studentId") ||
    localStorage.getItem("userId");

  // Auth token for protected API endpoints
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Handle missing authentication info
    if (!studentId || !token) {
      setError("Please log in to view your enrolled programs.");
      setLoading(false);
      return;
    }

    // Fetch enrolled programs for the logged-in student
    const fetchPrograms = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/enrollments/mycourses/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();

        // Set programs if valid data, otherwise empty array
        if (Array.isArray(data.courses)) {
          setPrograms(data.courses);
        } else {
          setPrograms([]);
        }
      } catch (err) {
        setError(err.message); // Show API error
      } finally {
        setLoading(false); // Stop loading spinner/message
      }
    };

    fetchPrograms();
  }, [studentId, token]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1 lg:ml-64 transition-all duration-300">
        
        {/* Header Component */}
        <Header />

        <main className="flex-1 p-8 mt-24">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">My Programs</h1>

            {/* Future: Filter Buttons */}
            {/* <div className="flex gap-4">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Filter
              </button>
            </div> */}
          </div>

          {/* Loading Message */}
          {loading && (
            <p className="text-center text-gray-500">Loading programs...</p>
          )}

          {/* Error Message */}
          {error && !loading && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}

          {/* Empty State Message */}
          {!loading && programs.length === 0 && !error && (
            <p className="text-center text-gray-500">
              You are not enrolled in any programs.
            </p>
          )}

          {/* Programs Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-lg transition"
              >
                {/* Program Title */}
                <h2 className="text-xl font-semibold mb-2">{program.title}</h2>

                {/* Program Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {program.description || "No description available"}
                </p>

                {/* Future: View Program Button */}
                {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  View Program
                </button> */}
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer
          className="
            py-4 text-center border-t
            bg-gray-100 text-gray-700 border-gray-300 
            dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700
          "
        >
          <p className="text-sm">© 2025 UpToSkills. Built by learners.</p>
        </footer>

      </div>
    </div>
  );
};

export default MyPrograms;
