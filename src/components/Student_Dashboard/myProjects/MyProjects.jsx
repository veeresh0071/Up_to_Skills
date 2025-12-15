// src/components/Student_Dashboard/myProjects/MyProjects.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import Footer from '../dashboard/Footer';
import ProjectSubmissionForm from './ProjectSubmissionForm';
import { useTheme } from '../../../context/ThemeContext';
import { motion } from 'framer-motion';

function MyProjects() {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW STATES FOR DELETE POPUP
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const studentId =
    localStorage.getItem("id") ||
    localStorage.getItem("studentId") ||
    localStorage.getItem("userId");

  const token = localStorage.getItem("token");

  // Fetch student's projects
  useEffect(() => {
    if (!studentId || !token) {
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/projects/assigned/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setProjects(data.data);
          } else if (Array.isArray(data)) {
            setProjects(data);
          }
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [studentId, token]);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const handleProjectAdded = (newProject) => {
    setProjects([newProject, ...projects]);
    setShowForm(false);
  };

  // OPEN DELETE POPUP
  const openDeletePopup = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeletePopup(true);
  };

  // CONFIRM DELETE
  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setProjects(projects.filter(p => p.id !== projectToDelete));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }

    setShowDeletePopup(false);
    setProjectToDelete(null);
  };

  return (
    <div
      className={`flex min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Header onMenuClick={toggleSidebar} />

        <div className="flex-grow pt-24 px-4 sm:px-6 py-6">
          <div className="max-w-6xl mx-auto">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold">My Projects</h1>
            </div>

            {/* Show Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <ProjectSubmissionForm onProjectAdded={handleProjectAdded} />
              </motion.div>
            )}

            {/* Projects List */}
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div
                    className={`animate-spin rounded-full h-12 w-12 border-t-4 ${
                      darkMode ? "border-blue-400" : "border-blue-500"
                    }`}
                  ></div>
                </div>
              ) : projects.length === 0 && !showForm ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-12 rounded-lg border-2 border-dashed ${
                    darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    You haven't submitted any projects yet. 
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`rounded-lg shadow-lg overflow-hidden flex flex-col ${
                        darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                      }`}
                    >
                      {/* Card Header */}
                      <div className={`p-6 ${darkMode ? "bg-gray-700" : "bg-gradient-to-r from-blue-50 to-indigo-50"}`}>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2">{project.title}</h3>
                        <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tech_stack?.split(",").slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2 py-1 rounded-full ${
                                darkMode ? "bg-gray-600 text-gray-200" : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex-grow">
                        {project.contributions && (
                          <div className="mb-4">
                            <p className={`text-xs font-semibold mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              Your Contributions:
                            </p>
                            <p className={`text-sm line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {project.contributions}
                            </p>
                          </div>
                        )}

                        {project.is_open_source && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            ✓ Open Source
                          </span>
                        )}

                        {project.github_pr_link && (
                          <a
                            href={project.github_pr_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium truncate mt-2 block"
                          >
                            → View on GitHub
                          </a>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className={`px-6 py-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                        <button
                          onClick={() => openDeletePopup(project.id)}
                          className="w-full px-3 py-2 rounded text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DELETE CONFIRMATION POPUP */}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`rounded-2xl p-8 w-full max-w-md shadow-xl ${
                darkMode
                  ? "bg-gray-900 border border-gray-700 text-white"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
            >
              <h3 className="text-2xl font-bold mb-4">Delete Project?</h3>
              <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Are you sure you want to delete this project? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

export default MyProjects;
