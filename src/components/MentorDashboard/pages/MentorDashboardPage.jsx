import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WelcomeSection from "../components/Welcome";
import { useTheme } from "../../../context/ThemeContext";

const MentorDashboardPage = () => {
  // Theme context to detect dark/light mode
  const { darkMode: isDarkMode } = useTheme();

  const navigate = useNavigate();

  // Dashboard counters
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMentors, setTotalMentors] = useState(0);
  const [assignedProgramsCount, setAssignedProgramsCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardCounts = async () => {
      // Get token from localStorage for authenticated API calls
      const token = localStorage.getItem("token");
      const axiosConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      try {
        const [studentsRes, mentorsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/students/count", axiosConfig),
          axios.get("http://localhost:5000/api/mentors/count", axiosConfig),
        ]);

        if (isMounted) {
          setTotalStudents(studentsRes.data?.totalStudents ?? 0);
          setTotalMentors(mentorsRes.data?.totalMentors ?? 0);
        }
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      }

      // Fetch assigned programs for current logged-in mentor
      const currentUser = localStorage.getItem("user");
      if (!currentUser) return;

      try {
        const user = JSON.parse(currentUser);
        const mentorId = user?.id;
        if (!mentorId) return;

        const res = await axios.get(
          `http://localhost:5000/api/assigned-programs/mentor/${mentorId}`,
          axiosConfig
        );

        if (isMounted) {
          // Ensure API returned an array before counting
          if (res.data?.success && Array.isArray(res.data?.data)) {
            setAssignedProgramsCount(res.data.data.length);
          } else {
            setAssignedProgramsCount(0);
          }
        }
      } catch (err) {
        console.error("Error fetching assigned programs:", err);
        if (isMounted) setAssignedProgramsCount(0);
      }
    };

    loadDashboardCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dashboard cards configuration
  const dashboardFeatures = [
    {
      icon: "📋",
      title: "My Programs",
      description: "Programs assigned to me",
      count: assignedProgramsCount, // shows number of programs assigned
      color: "primary",
      onClick: () => navigate("assigned-programs"), // navigate to assigned programs page
    },
    {
      icon: "👥",
      title: "Multi-Student View",
      description:
        "Easily toggle between multiple students to evaluate and mentor efficiently.",
      onClick: () => navigate("multi-student"), // navigate to multi-student view
    },
  ];

  return (
    <div
      className={`mt-14 flex min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top header bar */}
        <Header />

        <div
          className={`flex-1 p-8 transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          {/* Welcome message section */}
          <WelcomeSection />

          {/* Dashboard cards */}
          <div className="flex flex-wrap justify-center gap-6">
            {dashboardFeatures.map((feature, index) => (
              <DashboardCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                count={feature.count}   // Passing count to card
                color={feature.color}   // Passing optional color theme
                onClick={feature.onClick}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>

        {/* Bottom footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MentorDashboardPage;
