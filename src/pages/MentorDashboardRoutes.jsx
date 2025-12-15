import React from "react";
import { Routes, Route } from "react-router-dom";

/* 
  Importing all mentor dashboard pages.
  Each page represents a different section inside the mentor's dashboard layout.
*/
import MentorDashboardPage from "../components/MentorDashboard/pages/MentorDashboardPage";
import ProjectsProgress from "../components/MentorDashboard/pages/ProjectsProgress";
import OpenSourceContributions from "../components/MentorDashboard/pages/OpenSourceContributions";
import MultiStudent from "../components/MentorDashboard/pages/MultiStudent";
import MentorProfilePage from "../components/MentorDashboard/components/MentorProfilePage";
import MentorEditProfilePage from "../components/MentorDashboard/components/MentorEditProfilePage";
import AboutUs from "../components/MentorDashboard/pages/AboutUs";
import AssignedPrograms from "../components/MentorDashboard/pages/AssignedPrograms";

// Global Theme Context to handle dark/light mode inside mentor dashboard
import { useTheme } from "../context/ThemeContext";

function MentorDashboardRoutes() {
  // Extract darkMode + toggleDarkMode from theme context
  const { darkMode: isDarkMode, toggleDarkMode: setIsDarkMode } = useTheme();

  return (
    /* 
      React Router Route Configuration for Mentor Dashboard.
      All mentor-specific pages live inside <Routes>.
      Each <Route> loads a complete page component.
    */
    <Routes>

      {/* ======================= DEFAULT ROUTE ======================= 
          If user visits /mentor-dashboard → This loads first.
      */}
      <Route
        index
        element={
          <MentorDashboardPage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* ======================= PROJECTS PROGRESS PAGE ======================= */}
      <Route
        path="projects-progress"
        element={
          <ProjectsProgress
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* ======================= OPEN SOURCE CONTRIBUTIONS ======================= */}
      <Route
        path="open-source-contributions"
        element={
          <OpenSourceContributions
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* ======================= MULTI STUDENT VIEW ======================= 
          Mentor can view/manage multiple students from here.
      */}
      <Route
        path="multi-student"
        element={
          <MultiStudent
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* ======================= PROFILE PAGE ======================= */}
      <Route
        path="profile"
        element={
          <MentorProfilePage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* ======================= EDIT PROFILE PAGE ======================= */}
      <Route
        path="edit-profile"
        element={
          <MentorEditProfilePage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* ======================= ABOUT US PAGE ======================= */}
      <Route path="AboutUs" element={<AboutUs />} />

      {/* ======================= ASSIGNED PROGRAMS PAGE ======================= */}
      <Route
        path="assigned-programs"
        element={
          <AssignedPrograms
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />
    </Routes>
  );
}

export default MentorDashboardRoutes;
