import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";

function OpenSourceContributions({ isDarkMode, setIsDarkMode }) {
  // Holds all projects created/assigned to the mentor
  const [projects, setProjects] = useState([]);
  // Loading state for skeleton UI
  const [loading, setLoading] = useState(true);

  // Get the currently logged-in mentor from localStorage
  const mentor = JSON.parse(localStorage.getItem("mentor"));
  const mentorId = mentor?.id;

  useEffect(() => {
    // If mentor not found, stop execution
    if (!mentorId) return;

    // Fetch all mentor projects
    const loadProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/mentor_projects");
        const data = res.data;
        if (data?.success && Array.isArray(data?.data)) {
          // Filter projects which belong to the logged-in mentor
          const myProjects = data.data.filter((proj) => proj.mentor_id === mentorId);
          setProjects(myProjects);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [mentorId]);

  return (
    <div className="mt-14 flex min-h-screen">
      {/* Top navigation bar */}
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Left sidebar menu */}
      <Sidebar isDarkMode={isDarkMode} />

      <div className="flex flex-col flex-grow bg-gray-50 dark:bg-gray-900">
        <main className="px-8 lg:px-12 py-10 flex-grow w-full">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-300">
            My Programs
          </h1>

          {/* Page subtitle */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Manage and track all programs created by mentors.
          </p>

          <section className="mb-10">
            <div className="overflow-x-auto">
              {/* Programs Table */}
              <table className="min-w-full text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl overflow-hidden">
                <thead className="text-sm uppercase tracking-wide bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">
                      Program Title
                    </th>
                    <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">
                      Total Students
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {/* Skeleton Loader While Fetching Data */}
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-6 py-4 bg-gray-200 dark:bg-gray-700">&nbsp;</td>
                        <td className="px-6 py-4 bg-gray-200 dark:bg-gray-700">&nbsp;</td>
                      </tr>
                    ))

                  ) : projects.length === 0 ? (
                    // Show if no projects assigned
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No projects assigned yet.
                      </td>
                    </tr>

                  ) : (
                    // Render mentor’s list of projects
                    projects.map((proj) => (
                      <tr
                        key={proj.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200 ease-in-out"
                      >
                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-200">
                          {proj.project_title}
                        </td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                          {proj.total_students}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Footer always stays below content */}
        <Footer />
      </div>
    </div>
  );
}

export default OpenSourceContributions;
