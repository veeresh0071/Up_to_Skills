// src/pages/AdminPanel.jsx

// ===============================
//  ADMIN PANEL MAIN PAGE
//  - Handles layout, routing between internal components, theme, sidebar
//  - This is the central controller for all admin modules
// ===============================

import { useState } from "react";
import { motion } from "framer-motion";

// Importing all admin-related UI components.
// Each module is responsible for rendering its own section inside admin panel.
import AdminNavbar from "../components/AdminPanelDashboard/AdminNavbar";
import AdminSidebar from "../components/AdminPanelDashboard/AdminSidebar";
import DashboardMain from "../components/AdminPanelDashboard/DashboardMain";
import Students from "../components/AdminPanelDashboard/Students";
import Company from "../components/AdminPanelDashboard/Company";
import StudentsTable from "../components/AdminPanelDashboard/StudentsTable";
import CompaniesTable from "../components/AdminPanelDashboard/CompaniesTable";
import MentorsTable from "../components/AdminPanelDashboard/MentorsTable";
import Mentors from "../components/AdminPanelDashboard/Mentors";
import Project from "../components/AdminPanelDashboard/Project";
import Analytics from "../components/AdminPanelDashboard/Analytics";
import MentorReview from "../components/AdminPanelDashboard/MentorReview";
import AdminNotifications from "../components/AdminPanelDashboard/AdminNotifications";
import ProgramsAdmin from "../components/AdminPanelDashboard/ProgramsAdmin";
import Programs from "../components/AdminPanelDashboard/Programs";
import Testimonials from "../components/AdminPanelDashboard/Testimonials";
import CoursesTable from "../components/AdminPanelDashboard/CoursesTable";
import AssignedPrograms from "../components/AdminPanelDashboard/AssignedPrograms";
import { useTheme } from "../context/ThemeContext";

function AdminPanel() {
  // ===============================
  // STATE MANAGEMENT
  // ===============================

  // Tracks which section (Dashboard / Students / Programs etc.) is active.
  // Sidebar buttons update this value.
  const [activeSection, setActiveSection] = useState("dashboard");

  // Controls sidebar visibility on smaller screens. (Responsive behavior)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Theme context: controls Dark Mode / Light Mode
  const { darkMode: isDarkMode, toggleDarkMode: toggleTheme } = useTheme();

  // ===============================
  // COMPONENT RENDERING LOGIC
  // Dynamically returns the correct module based on activeSection
  // Acts like a mini router inside the Admin Panel
  // ===============================
  const renderActiveModule = () => {
    switch (activeSection) {
      case "dashboard":
        // Dashboard page also receives navigation callback
        return (
          <DashboardMain
            isDarkMode={isDarkMode}
            onNavigateSection={(section) => setActiveSection(section)}
          />
        );

      case "students":
        return <Students isDarkMode={isDarkMode} />;

      case "students_table":
        // Students table includes navigation back to student page or edit page
        return (
          <StudentsTable
            isDarkMode={isDarkMode}
            onNavigateSection={(s) => setActiveSection(s)}
          />
        );

      case "mentors":
        return <Mentors isDarkMode={isDarkMode} />;

      case "companies":
        return <Company isDarkMode={isDarkMode} />;

      case "companies_table":
        return (
          <CompaniesTable
            isDarkMode={isDarkMode}
            onNavigateSection={(s) => setActiveSection(s)}
          />
        );

      case "projects":
        return <Project isDarkMode={isDarkMode} />;

      case "analytics":
        return <Analytics isDarkMode={isDarkMode} />;

      case "mentor":
        return <MentorReview isDarkMode={isDarkMode} />;

      case "programs":
        // Admin version of programs (CRUD for creating programs)
        return (
          <ProgramsAdmin
            isDarkMode={isDarkMode}
            onNavigateSection={(s) => setActiveSection(s)}
          />
        );

      case "assigned_programs":
        // Shows programs assigned to students
        return <AssignedPrograms isDarkMode={isDarkMode} />;

      case "courses_table":
        // Displays all available courses in table form
        return (
          <CoursesTable
            isDarkMode={isDarkMode}
            onNavigateSection={(s) => setActiveSection(s)}
          />
        );

      case "mentors_table":
        return (
          <MentorsTable
            isDarkMode={isDarkMode}
            onNavigateSection={(s) => setActiveSection(s)}
          />
        );

      case "notifications":
        return <AdminNotifications isDarkMode={isDarkMode} />;

      case "courses":
        // Programs List (User-facing view)
        return (
          <Programs
            isDarkMode={isDarkMode}
            onNavigateSection={(s) => setActiveSection(s)}
          />
        );

      case "testimonials":
        return <Testimonials isDarkMode={isDarkMode} />;

      // Fallback: When activeSection is invalid or not set
      default:
        // Default to Dashboard if section is unknown
        return (
          <DashboardMain
            isDarkMode={isDarkMode}
            onNavigateSection={(section) => setActiveSection(section)}
          />
        );
    }
  };

  // Toggle sidebar open/close (especially useful for mobile/tablet)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ===============================
  // MAIN PAGE UI
  // Contains: Sidebar + Navbar + Header + Dynamic Module Renderer + Footer
  // ===============================
  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* =============================== */}
      {/* SIDEBAR SECTION */}
      {/* =============================== */}
      <AdminSidebar
        isOpen={isSidebarOpen} // Controls drawer state
        setIsOpen={setIsSidebarOpen} // Update sidebar state
        activeSection={activeSection} // Highlight active menu item
        setActiveSection={setActiveSection} // Change page on click
        isDarkMode={isDarkMode} // Theme support
      />

      {/* =============================== */}
      {/* MAIN CONTENT WRAPPER */}
      {/* =============================== */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* =============================== */}
        {/* TOP NAVIGATION BAR */}
        {/* Contains menu button + theme toggle */}
        {/* =============================== */}
        <AdminNavbar
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {/* =============================== */}
        {/* MAIN PAGE BODY */}
        {/* Contains animated header + active module */}
        {/* =============================== */}
        <main className="pt-20 px-4 sm:px-6 py-6">
          {/* Admin Dashboard Header Section */}
          <motion.section
            className={`rounded-2xl p-8 mb-8 transition-all duration-500 ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
                : "bg-gradient-to-br from-white to-gray-100 text-gray-900"
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* MAIN TITLE */}
            <motion.h1
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              UptoSkills Admin Dashboard
            </motion.h1>

            {/* Subtitle under heading */}
            <motion.p
              className={`text-xl ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Manage students, companies, projects, and analytics from one place.
            </motion.p>
          </motion.section>

          {/* =============================== */}
          {/* DYNAMIC MODULE RENDERING HERE */}
          {/* Based on sidebar selection */}
          {/* =============================== */}
          {renderActiveModule()}
        </main>

        {/* =============================== */}
        {/* FOOTER SECTION */}
        {/* Always at bottom of page */}
        {/* =============================== */}
        <footer
          className={`w-full text-center py-4 text-sm transition-colors duration-500 mt-auto ${
            isDarkMode
              ? "bg-gray-900 text-gray-300 border-t border-gray-700"
              : "bg-white text-gray-700 border-t border-gray-300"
          }`}
        >
          <p>© 2025 Uptoskills. Built by learners.</p>
        </footer>
      </div>
    </div>
  );
}

export default AdminPanel;
