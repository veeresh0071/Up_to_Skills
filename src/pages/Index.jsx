import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

// Company Dashboard Components
import Sidebar from "../components/Company_Dashboard/Sidebar";
import Navbar from "../components/Company_Dashboard/Navbar";
import StatCard from "../components/Company_Dashboard/StatCard";
import StudentCard from "../components/Company_Dashboard/StudentCard";
import SearchFilters from "../components/Company_Dashboard/SearchFilters";
import InterviewsSection from "../components/Company_Dashboard/InterviewsSection";
import InterviewGallery from "../components/Company_Dashboard/InterviewGallery";
import CompanyNotificationsPage from "../components/Company_Dashboard/CompanyNotificationsPage";
import SearchStudents from "../components/Company_Dashboard/SearchStudents";
import EditProfile from "../components/Company_Dashboard/EditProfile";
import AboutCompanyPage from "../components/Company_Dashboard/AboutCompanyPage";

import { motion } from "framer-motion";
import { Users, Calendar as CalIcon, Award, UserCheck } from "lucide-react";
import buisness from "../assets/buisness.jpeg";

// Modals
import StudentProfileModal from "../components/Company_Dashboard/StudentProfileModal";
import ContactModal from "../components/Company_Dashboard/ContactModal";

// Shared Components
import StatsGrid from "../components/Student_Dashboard/dashboard/StatsGrid";
import Footer from "../components/AboutPage/Footer";

// Valid view identifiers to prevent invalid state
const VALID_VIEWS = new Set([
  "dashboard",
  "search",
  "interviews",
  "edit-profile",
  "about-us",
  "notifications",
]);

// ==============================================
// MAIN COMPANY DASHBOARD PAGE
// Handles: 
// - Sidebar state
// - Fetch students
// - Filters
// - Interviews fetching
// - Page switching
// ==============================================
export default function Index() {

  // ----------------------------------------------
  // UI STATE
  // ----------------------------------------------
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);  // Sidebar toggle
  const [currentView, setCurrentView] = useState("dashboard"); // Current dashboard page

  // ----------------------------------------------
  // STUDENT DATA STATES
  // ----------------------------------------------
  const [students, setStudents] = useState([]);  // All students from API
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered result set
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Counts for statistics cards
  const [totalMentors, setTotalMentors] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);

  // Autocomplete name suggestion states
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [allStudentNames, setAllStudentNames] = useState([]);

  // ----------------------------------------------
  // FILTER STATES → Used in Search/Filtering
  // ----------------------------------------------
  const [filters, setFilters] = useState({
    name: "",
    domain: "All Domains",
    projectExperience: "All Levels",
    skillLevel: "All Skills",
  });

  // ----------------------------------------------
  // MODAL STATES
  // ----------------------------------------------
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Profile modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactStudentId, setContactStudentId] = useState(null);

  // Interview count for dashboard cards
  const [interviewCount, setInterviewCount] = useState(0);

  // ----------------------------------------------
  // CURRENT USER (Company profile)
  // ----------------------------------------------
  const rawUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  let currentUserName = "Account";

  try {
    if (rawUser) {
      const u = JSON.parse(rawUser);
      currentUserName = u.full_name || u.name || u.username || currentUserName;
    }
  } catch {
    currentUserName = "Account";
  }

  // ----------------------------------------------
  // NAME SUGGESTION GENERATOR (useMemo Optimization)
  // Avoids recalculations when students array changes
  // ----------------------------------------------
  const suggestionPool = useMemo(() => {
    const dedupe = (items) => {
      const seen = new Set();
      const result = [];

      items.forEach((value) => {
        const name = value?.toString().trim();
        if (!name) return;

        const key = name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push(name);
        }
      });

      return result;
    };

    // Prefer full list when available
    if (allStudentNames.length) return dedupe(allStudentNames);

    return dedupe(students.map((s) => s.full_name));
  }, [students, allStudentNames]);

  // ============================================================
  // FETCH STUDENTS + MENTOR COUNT
  // Runs once on mount
  // ============================================================
  useEffect(() => {
    const fetchData = async () => {
      setLoadingStudents(true);

      try {
        const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

        // Authentication header
        const token = localStorage.getItem("token");
        const headers = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        // Run student + mentor requests in parallel
        const [studentsRes, mentorRes] = await Promise.all([
          axios.get(`${API_BASE}/api/students`, headers),
          axios.get(`${API_BASE}/api/mentors/count`, headers),
        ]);

        // Normalizing student rows into a consistent structure
        const rows = Array.isArray(studentsRes.data.data)
          ? studentsRes.data.data
          : [];

        const formatted = rows.map((r) => {
          // Parse domains_of_interest safely
          let domains = [];
          try {
            if (Array.isArray(r.domains_of_interest)) {
              domains = r.domains_of_interest;
            } else if (typeof r.domains_of_interest === "string") {
              const trimmed = r.domains_of_interest.trim();
              if (trimmed.startsWith("[")) {
                domains = JSON.parse(trimmed) || [];
              } else if (trimmed.includes(",")) {
                domains = trimmed.split(",").map((s) => s.trim());
              } else if (trimmed.length > 0) {
                domains = [trimmed];
              }
            }
          } catch {
            domains = r.domains_of_interest
              ? [String(r.domains_of_interest)]
              : [];
          }

          // Unified student object structure
          return {
            id:
              r.id ??
              r.student_id ??
              r._id ??
              `student-${Math.random().toString(36).slice(2, 9)}`,
            full_name:
              r.full_name || r.name || r.student_name || "Unknown Student",
            domain: domains[0] || r.ai_skill_summary || "Web Development",
            skillLevel: r.skill_level || "Intermediate",
            badges: domains.slice(0, 4).length
              ? domains.slice(0, 4)
              : ["Profile"],

            location: r.location || "Unknown",
            experience: r.experience || "1 year",
            rating: r.rating ?? null,
            lastActive: r.last_active || "Recently active",

            ai_skill_summary: r.ai_skill_summary || r.ai_skills || "",
            created_at:
              r.created_at || r.profile_created_at || new Date().toISOString(),

            __raw: r, // original payload (for debugging)
          };
        });

        // Update UI states
        setStudents(formatted);
        setFilteredStudents(formatted);
        setTotalMentors(mentorRes.data.totalMentors || 0);

        // Count total badges
        const totalBadgesCount = formatted.reduce(
          (sum, s) => sum + (s.badges?.length || 0),
          0
        );
        setTotalBadges(totalBadgesCount);
      } catch (err) {
        console.error("Error fetching data:", err);
        setStudents([]);
        setFilteredStudents([]);
        setTotalMentors(0);
        setTotalBadges(0);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchData();
  }, []);

  // ============================================================
  // APPLY SEARCH + FILTERS ON STUDENTS
  // ============================================================
  useEffect(() => {
    let filtered = students;

    // Filter by name
    if (filters.name.trim()) {
      const q = filters.name.toLowerCase();
      filtered = filtered.filter((s) =>
        (s.full_name || "").toLowerCase().includes(q)
      );
    }

    // Filter by domain
    if (filters.domain !== "All Domains") {
      filtered = filtered.filter((s) =>
        (s.domain || "").toLowerCase().includes(filters.domain.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [filters, students]);

  // ============================================================
  // FETCH NAMES FOR AUTOCOMPLETE
  // ============================================================
  useEffect(() => {
    const fetchAllStudentNames = async () => {
      try {
        const API_BASE =
          process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await axios.get(`${API_BASE}/api/students/all-students`);

        const rows = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        const names = rows.map((r) =>
          (r.full_name ||
            r.name ||
            r.student_name ||
            r.profile_full_name ||
            ""
          ).toString().trim()
        );

        setAllStudentNames(names.filter(Boolean));
      } catch (err) {
        console.warn("Unable to fetch student names for suggestions", err);
      }
    };

    fetchAllStudentNames();
  }, []);

  // ============================================================
  // UPDATE NAME SUGGESTIONS WHEN USER TYPES
  // ============================================================
  useEffect(() => {
    const query = filters.name.trim().toLowerCase();

    if (!query) {
      setNameSuggestions(suggestionPool.slice(0, 8));
      return;
    }

    setNameSuggestions(
      suggestionPool
        .filter((name) => name.toLowerCase().includes(query))
        .slice(0, 8)
    );
  }, [filters.name, suggestionPool]);

  // ============================================================
  // LOCAL STORAGE VIEW HANDLING
  // Allows opening "interviews" or "notifications" directly
  // ============================================================
  useEffect(() => {
    try {
      const view = localStorage.getItem("company_view");

      if (view && VALID_VIEWS.has(view)) {
        setCurrentView(view === "interviews" ? "interviews" : view);
      }

      localStorage.removeItem("company_view");
    } catch {}
  }, []);

  // ============================================================
  // INTERVIEWS FETCHING + EVENT LISTENER
  // Supports real-time updates from other pages
  // ============================================================
  const [interviews, setInterviews] = useState([]);

  const fetchInterviews = async () => {
    try {
      const API_BASE =
        process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_BASE}/api/interviews`);

      if (Array.isArray(res.data)) {
        setInterviews(res.data);
        setInterviewCount(res.data.length);
      } else {
        setInterviews([]);
        setInterviewCount(0);
      }
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setInterviews([]);
      setInterviewCount(0);
    }
  };

  useEffect(() => {
    fetchInterviews();

    // Normalize API structure
    const normalizeInterview = (r) => ({
      id: r.id ?? r._id ?? r.interview_id ?? r.interviewId ?? null,
      candidate_name: r.candidate_name ?? r.candidateName ?? r.name ?? "",
      role: r.role ?? r.position ?? r.job ?? "",
      date: r.date ?? r.scheduled_date ?? r.slot_date ?? null,
      time: r.time ?? r.scheduled_time ?? r.slot_time ?? null,
      status: r.status ?? r.state ?? "Scheduled",
      raw: r,
    });

    // When new interview created
    const onCreated = (e) => {
      try {
        const created = e?.detail;
        if (created) {
          const normalized = normalizeInterview(created);

          setInterviews((prev) => {
            if (!normalized.id) return [normalized, ...prev];
            if (prev.some((p) => p.id === normalized.id)) return prev;
            return [normalized, ...prev];
          });

          setInterviewCount((c) => c + 1);
          return;
        }
      } catch {}

      // Fallback → re-fetch full list
      fetchInterviews();
    };

    window.addEventListener("interview:created", onCreated);
    return () => window.removeEventListener("interview:created", onCreated);
  }, []);

  // ============================================================
  // SIDEBAR & VIEW HANDLERS
  // ============================================================
  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  const handleSidebarClick = (v) => {
    if (!v) return;

    if (v === "interviews") {
      setCurrentView("interviews");
      return;
    }

    if (VALID_VIEWS.has(v)) {
      setCurrentView(v);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (key, value) =>
    setFilters((p) => ({ ...p, [key]: value }));

  const clearFilters = () =>
    setFilters({
      name: "",
      domain: "All Domains",
      projectExperience: "All Levels",
      skillLevel: "All Skills",
    });

  const handleNameSuggestionSelect = (value) => {
    setFilters((prev) => ({ ...prev, name: value }));
    setShowNameSuggestions(false);
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleContact = (id) => {
    setContactStudentId(id);
    setIsContactModalOpen(true);
  };

  // ============================================================
  // PAGE SWITCHING AREA (View Renderer)
  // ============================================================

  // ---- Notifications Page ----
  if (currentView === "notifications") {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex-1 flex flex-col ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <main className="flex-1 pt-16">
            <CompanyNotificationsPage />
          </main>
        </div>
      </div>
    );
  }

  // ---- Search Students ----
  if (currentView === "search") {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex-1 flex flex-col ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <main className="flex-1 pt-16">
            <SearchStudents />
          </main>
        </div>
      </div>
    );
  }

  // ---- Edit Profile Page ----
  if (currentView === "edit-profile") {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex-1 flex flex-col ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <div className="pt-20 px-2 sm:px-4 pb-6 max-w-[1400px] mx-auto">
            <EditProfile />
          </div>
        </div>
      </div>
    );
  }

  // ---- Interviews Page ----
  if (currentView === "interviews") {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div className={`flex-1 flex flex-col ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}>
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <main className="flex-1 pt-16">
            <InterviewGallery />
          </main>
        </div>
      </div>
    );
  }

  // ---- About Company ----
  if (currentView === "about-us") {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex flex-col ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          } text-gray-900 dark:text-white`}
        >
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <main className="flex flex-grow">
            <AboutCompanyPage />
          </main>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN DASHBOARD VIEW
  // ============================================================
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onItemClick={handleSidebarClick}
      />

      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />

        <div className="pt-20 px-2 sm:px-4 py-6 max-w-[1400px] mx-auto w-full">

          {/* Hero Section */}
          <motion.section
            className="mb-8 p-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

              {/* Right Image */}
              <div className="mt-6 lg:mt-0 lg:order-2 flex justify-center lg:justify-end">
                <motion.img
                  src={buisness}
                  alt="Business Analytics"
                  className="w-full max-w-[400px] object-cover rounded-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>

              {/* Left Text */}
              <div className="lg:col-span-2 lg:order-1">
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 dark:text-white"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-[#01BDA5] via-[#43cea2] to-[#FF824C] bg-clip-text text-transparent font-extrabold">
                    UptoSkill
                  </span>{" "}
                  Hiring Dashboard
                </motion.h1>

                <motion.p
                  className="text-base sm:text-xl mb-4 text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Discover talented students, schedule interviews, and build
                  your dream team with our comprehensive hiring platform.
                </motion.p>
              </div>
            </div>
          </motion.section>

          {/* STATS SECTION */}
          <section className="mb-8">
            <motion.h2
              className="text-2xl font-bold mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Hiring Overview
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Students Available"
                value={students.length}
                icon={Users}
                color="primary"
                delay={0.1}
              />
              <StatCard
                title="Interviews Scheduled"
                value={interviewCount}
                icon={CalIcon}
                color="secondary"
                delay={0.3}
              />
              <StatCard
                title="Total Mentors"
                value={totalMentors}
                icon={UserCheck}
                color="success"
                delay={0.2}
              />
              <StatCard
                title="Verified Skill Badges"
                value={totalBadges}
                icon={Award}
                color="warning"
                delay={0.4}
              />
            </div>
          </section>
        </div>

        {/* Student Profile Modal */}
        <StudentProfileModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          student={selectedStudent}
          fetchFresh
        />

        {/* Contact Modal */}
        <ContactModal
          open={isContactModalOpen}
          studentId={contactStudentId}
          onClose={() => setIsContactModalOpen(false)}
        />

        <Footer />
      </div>
    </div>
  );
}
