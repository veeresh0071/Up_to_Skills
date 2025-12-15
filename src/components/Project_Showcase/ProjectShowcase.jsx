// ProjectShowcase.jsx - IMPROVED VERSION
import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const ProjectShowcase = ({ isDarkMode: propDarkMode }) => {
  const { darkMode: contextDarkMode } = useTheme();
  const isDarkMode = propDarkMode !== undefined ? propDarkMode : contextDarkMode;
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from backend
  useEffect(() => {
    // ✅ Try multiple keys for backward compatibility
    const studentId = localStorage.getItem("id") || 
                      localStorage.getItem("studentId") || 
                      localStorage.getItem("userId");
    const token = localStorage.getItem('token');

    console.log("ProjectShowcase - Student ID:", studentId);
    console.log("ProjectShowcase - Token exists:", !!token);
    
    // Check if credentials are missing
    if (!studentId || !token) {
      console.warn("ProjectShowcase: Student ID or Token is missing.");
      setError("Please log in to view your projects.");
      setLoading(false);
      return; 
    }

    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/projects/assigned/${studentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.error(`Fetch failed with status: ${res.status}`);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched projects:", data);
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        } else if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
        setProjects([]);
      })
      .finally(() => {
        setLoading(false); 
      });

  }, []); // Only run once on mount

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
        {loading ? (
          // Skeleton loaders
          Array.from({ length: 6 }).map((_, idx) => (
            <motion.div
              key={idx}
              className="stat-card p-6 animate-pulse bg-gray-200 rounded-lg dark:bg-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="h-6 w-3/4 bg-gray-300 mb-4 rounded dark:bg-gray-600"></div>
              <div className="h-4 w-1/2 bg-gray-300 mb-2 rounded dark:bg-gray-600"></div>
              <div className="h-4 w-1/3 bg-gray-300 rounded dark:bg-gray-600"></div>
            </motion.div>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-full flex items-center justify-center min-h-[300px]">
            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
                {error}
              </h3>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : projects.length === 0 ? (
          // Empty state
          <div className="col-span-full flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Projects Found
              </h3>
              
            </div>
          </div>
        ) : (
          // Project cards
          projects.map((proj, idx) => (
            <ProjectCard
              key={proj.id || idx}
              project={proj}
              onClick={() => setSelectedProject(proj)}
              isDarkMode={isDarkMode}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default ProjectShowcase;
