import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";

const safeData = (data) => (data ? data : "N/A");

const MultiStudent = ({ isDarkMode, setIsDarkMode }) => {
  const [students, setStudents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // Fetch ALL students (includes github, linkedin, why hire me, etc.)
  // ------------------------------------
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students");
        const data = res.data;
        if (data?.success && Array.isArray(data?.data)) {
          setStudents(data.data);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Carousel Controls
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? students.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === students.length - 1 ? 0 : prev + 1
    );
  };

  const currentStudent = students[currentIndex];

  const {
    username,
    full_name,
    email,
    contact_number,
    linkedin_url,
    github_url,
    why_hire_me,
    ai_skill_summary,
    profile_completed,
  } = currentStudent || {};

  // ------------------------------------
  // Rendering UI (unchanged)
  // ------------------------------------

  let content;
  if (loading) {
    content = (
      <p className="text-gray-700 dark:text-gray-300 text-xl">Loading...</p>
    );
  } else if (!students.length) {
    content = (
      <p className="text-gray-700 dark:text-gray-300 text-xl">
        No students found 😢
      </p>
    );
  } else {
    content = (
      <>
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="text-3xl p-3 rounded-full border border-gray-400 hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-gray-700 dark:text-white transition-colors"
        >
          ❮
        </button>

        {/* Student Card */}
        <div className="w-full max-w-lg border p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800 dark:border-gray-700 transition-shadow">
          <h3 className="text-xl font-bold mb-3 text-gray-700 dark:text-gray-300">
            Personal Information 🧑‍💻
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-base">
            {/* Username */}
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              User Name
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {safeData(username)}
            </span>

            {/* Full Name */}
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Full Name
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {safeData(full_name)}
            </span>

            {/* Email */}
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Email
            </span>
            <span className="truncate text-gray-900 dark:text-gray-100">
              {safeData(email)}
            </span>

            {/* Contact Number */}
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Contact Number
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {safeData(contact_number)}
            </span>

            {/* LinkedIn */}
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              LinkedIn URL
            </span>
            {linkedin_url ? (
              <a
                href={linkedin_url}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            ) : (
              <span className="text-gray-500">N/A</span>
            )}

            {/* GitHub */}
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              GitHub URL
            </span>
            {github_url ? (
              <a
                href={github_url}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            ) : (
              <span className="text-gray-500">N/A</span>
            )}

            {/* Profile Completed */}
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Profile Completed
            </span>
            <span
              className={`font-bold ${profile_completed ? "text-green-600" : "text-red-600"
                }`}
            >
              {profile_completed ? "Yes ✅" : "No ❌"}
            </span>

          </div>



          <h3 className="text-xl font-bold mt-6 mb-3 text-gray-700 dark:text-gray-300">
            Career Snapshot 🚀
          </h3>

          <div className="flex flex-col space-y-4 text-base">
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                Why Hire Me
              </span>
              <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md border dark:border-gray-600 text-sm italic">
                {safeData(why_hire_me)}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                AI Skill Summary
              </span>
              <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md border dark:border-gray-600 text-sm italic">
                {safeData(ai_skill_summary)}
              </p>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="text-3xl p-3 rounded-full border border-gray-400 hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-gray-700 dark:text-white transition-colors"
        >
          ❯
        </button>
      </>
    );
  }

  return (
    <div className={`mt-14 flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Sidebar isDarkMode={isDarkMode} />

      <div className="flex flex-col flex-grow bg-white dark:bg-gray-900">
        <main className="flex-grow py-12 px-6 lg:px-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-2 text-gray-900 dark:text-white">
              Multi-Student View 🧑‍🎓
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor and manage all your students using the carousel view.
            </p>
          </div>

          <div className="mt-16 flex items-center justify-center space-x-6 min-h-[500px]">
            {content}
          </div>
        </main>

        <footer
          className={`w-full text-center py-4 text-sm border-t ${isDarkMode
            ? "bg-gray-900 text-gray-300 border-gray-700"
            : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
        >
          © 2025 Uptoskills. Built by learners.
        </footer>
      </div>
    </div>
  );
};

export default MultiStudent;
