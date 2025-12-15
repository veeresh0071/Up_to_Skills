import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { persistThemePreference, readStoredTheme } from "./lib/utils";
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

// Pages & Components
import Landing from './pages/Landing';
import Student_Dashboard from "./pages/Student_Dashboard";
import EditProfilePage from './components/Student_Dashboard/EditProfile/EditProfilePage';
import UserProfilePage from './components/Student_Dashboard/UserProfilePage';
import MyProjects from './components/Student_Dashboard/myProjects/MyProjects'; // ✅ For viewing projects
import AddProject from './components/Student_Dashboard/myProjects/AddProject'; // ✅ NEW: For adding projects
import SkillBadgeForm from './components/MentorDashboard/components/SkillBadges/SkillBadgeForm';
import NotificationsPage from './components/Student_Dashboard/NotificationsPage/NotificationsPage';
import LoginForm from './pages/Login';
import RegistrationForm from './pages/Register';
import CompanyDashboardHome from "./pages/Index";
import CompanyNotFound from "./pages/NotFound";
import ContactPage from './pages/ContactPage';
import ProjectShowcasePage from './pages/ProjectShowcasePage';
import MentorDashboardRoutes from './pages/MentorDashboardRoutes';
import AdminPanel from './pages/AdminPanel';
import ProgramsPage from './pages/ProgramsPage';
import Chatbot from './components/Contact_Page/Chatbot';
import CompanyProfilePage from './components/Company_Dashboard/companyProfilePage';
import StudentSkillBadgesPage from "./components/Student_Dashboard/Skilledpage/StudentSkillBadgesPage";
import Dashboard_Project from './components/Student_Dashboard/dashboard/Dashboard_Project';
import AboutUs from "./components/Student_Dashboard/dashboard/AboutUs";
import MyPrograms from "./components/Student_Dashboard/dashboard/MyPrograms";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// About Page Components
import Header from './components/AboutPage/Header';
import HeroSection from './components/AboutPage/HeroSection';
import AboutSection from './components/AboutPage/AboutSection';

// Program Components
import Webdev from './components/Programs/Webdev';
import Datascience from './components/Programs/Datascience';
import Cloudcompute from './components/Programs/Cloudcompute';
import Cybersecurity from './components/Programs/Cybersecurity';
import Thankyou from './components/Programs/Thankyou';

const queryClient = new QueryClient();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          pauseOnHover
          newestOnTop
          theme="light"
          style={{ zIndex: 99999 }}
        />
        <Router>
          <Routes>
            {/* ========== PUBLIC ROUTES (No Login Required) ========== */}
            <Route path="/" element={<Landing isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />

            <Route path="/about" element={
              <>
                <Header />
                <HeroSection />
                <AboutSection />
                <footer className="w-full text-gray-100 bg-gray-700 border-t border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 text-center py-4 text-sm transition-colors duration-300">
                  <p>© 2025 Uptoskills. Built by learners.</p>
                </footer>
                <Chatbot />
              </>
            } />

            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/login/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<RegistrationForm />} />

            {/* Program Forms */}
            <Route path="/programForm/:id" element={<Webdev />} />
            <Route path="/data-science" element={<Datascience />} />
            <Route path="/cloud-computing" element={<Cloudcompute />} />
            <Route path="/cybersecurity" element={<Cybersecurity />} />
            <Route path="/thankyou" element={<Thankyou />} />

            {/* ========== STUDENT PROTECTED ROUTES ========== */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Student_Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/profile" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <UserProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/edit-profile" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <EditProfilePage />
              </ProtectedRoute>
            } />

            {/* ✅ FIXED: Add Project route - shows ProjectSubmissionForm */}
            <Route path="/dashboard/add-project" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <AddProject />
              </ProtectedRoute>
            } />

            {/* ✅ FIXED: My Projects route - shows list of submitted projects */}
            <Route path="/dashboard/my-projects" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyProjects />
              </ProtectedRoute>
            } />

            {/* My Programs uses the correct component */}
            <Route path="/dashboard/my-programs" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyPrograms />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/Notifications" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <NotificationsPage />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/projects" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Dashboard_Project />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/project-showcase" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Dashboard_Project view="student" />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/aboutus" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <AboutUs />
              </ProtectedRoute>
            } />

            <Route path="/student/skill-badges" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentSkillBadgesPage />
              </ProtectedRoute>
            } />

            {/* ========== MENTOR PROTECTED ROUTES ========== */}
            <Route path="/mentor-dashboard/*" element={
              <ProtectedRoute allowedRoles={["mentor"]}>
                <MentorDashboardRoutes isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
              </ProtectedRoute>
            } />

            <Route path="/mentor-dashboard/skill-badges" element={
              <ProtectedRoute allowedRoles={["mentor"]}>
                <SkillBadgeForm isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            } />

            <Route path="/mentor-dashboard/project-showcase" element={
              <ProtectedRoute allowedRoles={["mentor"]}>
                <Dashboard_Project view="mentor" />
              </ProtectedRoute>
            } />

            {/* ========== COMPANY PROTECTED ROUTES ========== */}
            <Route path="/company" element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyDashboardHome />
              </ProtectedRoute>
            } />

            <Route path="/company-profile" element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/company/*" element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyNotFound />
              </ProtectedRoute>
            } />

            {/* ========== ADMIN PROTECTED ROUTES ========== */}
            <Route path="/adminPanel" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            } />

            <Route path="/adminPanel/testimonials" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            } />

            {/* ========== GENERAL PROTECTED ROUTES (Any logged-in user) ========== */}
            <Route path="/projectShowcase" element={
              <ProtectedRoute>
                <ProjectShowcasePage />
              </ProtectedRoute>
            } />

            {/* ========== ERROR PAGES ========== */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;