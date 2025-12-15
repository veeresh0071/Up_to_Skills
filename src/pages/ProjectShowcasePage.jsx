import { useState } from 'react';

// Student Dashboard Layout Components
import Sidebar from '../components/Student_Dashboard/dashboard/Sidebar';
import ProjectShowcase from '../components/Project_Showcase/ProjectShowcase';
import Footer from '../components/Project_Showcase/Footer';
import Header from '../components/Student_Dashboard/dashboard/Header';

// Global Theme Support
import { useTheme } from '../context/ThemeContext';

/*
  =====================================================================
    PROJECT SHOWCASE PAGE
    -------------------------------------------------------------------
    • This page displays all student projects in a structured layout.
    • Reuses the student dashboard's Sidebar + Header for consistency.
    • Includes responsive sidebar animation and dark-mode support.
    • The main content is scrollable to keep header + sidebar fixed.
  =====================================================================
*/
function ProjectShowcasePage() {

  // Controls Sidebar open/close state
  const [isOpen, setIsOpen] = useState(true);

  // Global theme (Dark/Light mode)
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* =========================== SIDEBAR =========================== 
          From the student dashboard, reused for consistent UX.
          Collapsible on small screens using 'isOpen'.
      */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* =========================== MAIN CONTENT WRAPPER =========================== */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "lg:ml-64" : "ml-0"
        }`}
      >

        {/* =========================== HEADER =========================== 
            Same header used in the student dashboard.
            Clicking menu toggles sidebar open/close.
        */}
        <Header onMenuClick={() => setIsOpen(!isOpen)} />

        {/* =========================== PAGE TITLE =========================== */}
        <header
          className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-center 
          py-6 sm:py-8 tracking-wide border-b-4 flex items-center justify-center mt-16
          ${darkMode ? "border-gray-700" : "border-[#00b2a9]"}`}
        >
          <span className="text-[#f26c3d]">My</span>&nbsp;
          <span className="text-[#00b2a9]">Projects</span>
        </header>

        {/* =========================== SCROLLABLE CONTENT =========================== 
            The main area scrolls independently while header + sidebar stay fixed.
        */}
        <div className="flex-1 overflow-y-auto">
          <ProjectShowcase isDarkMode={darkMode} />
        </div>

        {/* =========================== FOOTER =========================== */}
        <Footer isDarkMode={darkMode} />
      </div>
    </div>
  );
}

export default ProjectShowcasePage;
