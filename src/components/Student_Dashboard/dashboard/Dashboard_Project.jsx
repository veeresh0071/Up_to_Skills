import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "../../Project_Showcase/Footer";
import ProjectModal from "../../Project_Showcase/ProjectModal";
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import ProjectCard from '../../Project_Showcase/ProjectCard';
import { useTheme } from "../../../context/ThemeContext";

const Dashboard_Project = () => {
    const { darkMode } = useTheme(); // Get current theme (dark/light) from context
    const [loading, setLoading] = useState(true); // Loading state for projects
    const [selectedProject, setSelectedProject] = useState(null); // Track which project modal is open
    const [projects, setProjects] = useState([]); // Store fetched projects
    const [isSidebarVisible, setSidebarVisible] = useState(true); // Sidebar visibility for desktop
    const [isMobile, setIsMobile] = useState(false); // Track if screen is mobile size

    // Check screen size and toggle sidebar accordingly
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            setSidebarVisible(!mobile); // Hide sidebar by default on mobile
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // Fetch all projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projects = await fetch("http://localhost:5000/api/projects")
                    .then((res) => {
                        setLoading(false); // Stop loading once response received
                        return res.json().then((data) => {
                            if (data.success) {
                                setProjects(data.data); // Set projects data
                            } else {
                                setProjects([]); // Set empty array if no data
                            }
                        })
                    })
                const data = await projects.json();
                console.log(data); // Debug: log fetched data
            } catch (err) {
                console.error("Failed to fetch projects:", err); // Log any fetch errors
            }
        };
        fetchProjects();
    }, [])

    return (
        <div
            className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
        >
            {/* Sidebar component */}
            <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />

            {/* Main content area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarVisible ? "lg:ml-64" : "ml-0"}`}
            >
                {/* Header component */}
                <Header onMenuClick={() => setSidebarVisible(!isSidebarVisible)} />

                {/* Page content */}
                <div className='flex flex-col justify-center pt-24 px-4 sm:px-6 py-2 space-y-6 flex-grow'>
                    
                    {/* Page title */}
                    <header className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-center py-6 sm:py-8 tracking-wide border-b-4 flex items-center justify-center ${darkMode ? "border-gray-700" : "border-[#00b2a9]"}`}>
                        <span className="text-[#f26c3d]">All</span>
                        &nbsp;
                        <span className="text-[#00b2a9]">Projects</span>
                    </header>
                    
                    {/* Projects grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10'>
                        {loading ? (
                            // Show loading skeletons while fetching projects
                            Array.from({ length: 6 }).map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`stat-card p-6 animate-pulse rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className={`h-6 w-3/4 mb-4 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}></div>
                                    <div className={`h-4 w-1/2 mb-2 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}></div>
                                    <div className={`h-4 w-1/3 rounded ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}></div>
                                </motion.div>
                            ))
                        ) : projects.length === 0 ? (
                            // Show message if no projects are available
                            <div className="col-span-full flex items-center justify-center min-h-[300px]">
                                <div className="text-center">
                                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>No Projects</h3>
                                </div>
                            </div>
                        ) : (
                            // Map over projects and render ProjectCard for each
                            projects.map((proj, idx) => (
                                <ProjectCard
                                    key={idx}
                                    project={proj}
                                    onClick={() => setSelectedProject(proj)} // Open modal on click
                                    isDarkMode={darkMode}
                                />
                            ))
                        )}
                    </div>

                    {/* Project details modal */}
                    {selectedProject && (
                        <ProjectModal
                            project={selectedProject}
                            onClose={() => setSelectedProject(null)}
                            isDarkMode={darkMode}
                        />
                    )}
                </div>

                {/* Footer component */}
                <Footer isDarkMode={darkMode} />
            </div>
        </div>
    )
}

export default Dashboard_Project;
