import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MyCourses = () => {
  // Sidebar state: open/close
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Courses data state
  const [courses, setCourses] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Get studentId from localStorage to fetch user's courses
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    // Handle missing studentId gracefully
    if (!studentId) {
      console.error("❌ No student_id found in localStorage!");
      setLoading(false);
      return;
    }

    // Fetch courses for the logged-in student
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/enrollments/mycourses/${studentId}`
        );

        const data = await res.json();
        console.log("API Response:", data);

        // Set courses or empty array if none
        setCourses(data.courses || []);
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
      } finally {
        setLoading(false); // stop loading spinner/message
      }
    };

    fetchCourses();
  }, [studentId]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1 lg:ml-64 transition-all duration-300">
        
        {/* Header Component */}
        <Header />

        <main className="flex-1 p-8 mt-24">
          {/* Page Title */}
          <h1 className="text-3xl font-bold mb-6">My Courses</h1>

          {/* Loading Message */}
          {loading && <p className="text-gray-500 text-lg">Loading your courses...</p>}

          {/* No Courses Message */}
          {!loading && courses.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              You have not enrolled in any courses yet.
            </p>
          )}

          {/* Courses Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-lg transition"
              >
                {/* Course Title */}
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                
                {/* Course Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {course.description}
                </p>

                {/* View Course Button */}
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  View Course
                </button>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-700 py-4 text-center">
          <p className="text-sm">© 2025 UpToSkills. Built by learners.</p>
        </footer>
      </div>
    </div>
  );
};

export default MyCourses;
