import { useState, useEffect } from "react";

// Student Dashboard Layout Components
import Sidebar from "../components/Student_Dashboard/dashboard/Sidebar";
import Header from "../components/Student_Dashboard/dashboard/Header";
import WelcomeSection from "../components/Student_Dashboard/dashboard/WelcomeSection";
import StatsGrid from "../components/Student_Dashboard/dashboard/StatsGrid";
import Footer from "../components/Student_Dashboard/dashboard/Footer";

// Global Theme Context
import { useTheme } from "../context/ThemeContext";

/* =====================================================================================
   STUDENT DASHBOARD PAGE
   -------------------------------------------------------------------------------------
   - Main landing page for students after login.
   - Automatically manages:
        • Responsive sidebar behavior (hides on mobile)
        • Dark mode support
        • Fetches student ID from localStorage for personalized stats
   - Uses modular components for clean UI.
===================================================================================== */
const StudentDashboard = () => {

  /* ------------------------------------------------------------------
     Sidebar visibility state 
     - Desktop → Sidebar visible by default
     - Mobile  → Sidebar hidden by default
  ------------------------------------------------------------------ */
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  /* ------------------------------------------------------------------
     Detect mobile screen width (<= 1024px)
     Used to control automatic sidebar open/close
  ------------------------------------------------------------------ */
  const [isMobile, setIsMobile] = useState(false);

  /* ------------------------------------------------------------------
     Theme context → Dark / Light mode
  ------------------------------------------------------------------ */
  const { darkMode, toggleDarkMode } = useTheme();

  /* ------------------------------------------------------------------
     Student ID saved at login → used for StatsGrid data fetching
  ------------------------------------------------------------------ */
  const studentId = localStorage.getItem("studentId");

  /* ------------------------------------------------------------------
     Detect screen size on load + window resize
     This ensures:
       - Proper sidebar behavior on mobile/desktop
       - Adaptive layout on window resizing
  ------------------------------------------------------------------ */
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1024; // breakpoint for mobile/tablet
      setIsMobile(mobile);
      setSidebarVisible(!mobile); // Auto-hide sidebar on mobile
    };

    checkScreenSize(); // Run at initial load

    window.addEventListener("resize", checkScreenSize);

    // Cleanup to avoid memory leaks
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  /* =====================================================================================
     PAGE LAYOUT
  ===================================================================================== */
  return (
    <div
      className={`flex min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-[#f8fafc] text-gray-900"
      }`}
    >
      {/* =========================== SIDEBAR =========================== 
          - Collapsible sidebar for navigation
          - Controlled by state + responsive rules
      */}
      <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />

      {/* =========================== MAIN CONTENT WRAPPER =========================== */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* =========================== HEADER / NAVBAR =========================== 
            - Includes hamburger menu for mobile sidebar toggle
            - Includes dark mode toggle
        */}
        <Header
          onMenuClick={() => setSidebarVisible(!isSidebarVisible)}
          toggleDarkMode={toggleDarkMode}
        />

        {/* =========================== MAIN DASHBOARD CONTENT =========================== */}
        <div className="pt-24 px-4 sm:px-6 py-6 space-y-6 flex-grow">
          
          {/* Welcome Section → Personalized greeting */}
          <WelcomeSection />

          {/* Stats Section → Shows student progress, tasks, etc. */}
          <StatsGrid studentId={studentId} />

        </div>

        {/* =========================== FOOTER =========================== */}
        <Footer />
      </div>
    </div>
  );
};

export default StudentDashboard;
