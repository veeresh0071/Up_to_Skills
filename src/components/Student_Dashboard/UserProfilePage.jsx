



import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import Footer from "./dashboard/Footer.jsx";
import { useTheme } from "../../context/ThemeContext";

const UserProfilePage = () => {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Fetch user profile data 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const d = res.data.data;
        console.log("PROFILE RESPONSE:", d);

        setUserData({
          full_name: d.profile_full_name || d.student_name,
          username: d.username || d.student_name , 
          email: d.student_email,
          contact_number: d.contact_number || d.student_phone,
          linkedin_url: d.linkedin_url,
          github_url: d.github_url,
          why_hire_me: d.why_hire_me,
          ai_skill_summary: d.ai_skill_summary,
          domains_of_interest: d.domains_of_interest || [],
          others_domain: d.others_domain,
          profile_completed: d.profile_completed,
        });
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        
        if (err.response && err.response.status === 401) {
            localStorage.removeItem("token"); 
            localStorage.removeItem("user"); 
            setError("Session expired or invalid token. Please log in again.");
            navigate("/login"); 
            return;
        }
        
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]); 

  return (
    <div className={`flex min-h-screen transition-all duration-500 ${darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Sidebar and Header */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuClick={toggleSidebar} />

        {/* Profile Section */}
        <motion.div
          className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8"
          animate={{
            marginLeft: isOpen ? "16rem" : "0rem",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {loading ? (
            <p className="text-gray-700 dark:text-gray-300 text-center text-xl">
              Loading...
            </p>
          ) : error ? (
            <p className="text-red-600 dark:text-red-400 text-center font-semibold">
              {error}
            </p>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 dark:border-gray-700 transition-all duration-500">
              <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-700 dark:text-indigo-400">
                User Profile
              </h2>
              <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                View your saved profile details below.
              </p>

              <div className="space-y-4">
                {[
                  // 
                  ["Username", userData.username || "-"], 
                  ["Full Name", userData.full_name],
                  
                  ["Email", userData.email],
                  ["Contact Number", userData.contact_number],
                  [
                    "LinkedIn",
                    userData.linkedin_url ? (
                      <a
                        href={userData.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        {userData.linkedin_url}
                      </a>
                    ) : (
                      "-"
                    ),
                  ],
                  [
                    "GitHub",
                    userData.github_url ? (
                      <a
                        href={userData.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        {userData.github_url}
                      </a>
                    ) : (
                      "-"
                    ),
                  ],
                  ["Why Hire Me", userData.why_hire_me || "-"],
                  ["AI Skill Summary", userData.ai_skill_summary || "-"],
                  [
                    "Domains of Interest",
                    userData.domains_of_interest.length > 0
                      ? userData.domains_of_interest.join(", ")
                      : "-",
                  ],
                  [
                    "Profile Completed",
                    userData.profile_completed ? "✅ Yes" : "❌ No",
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                      {label}
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <Footer />
      </div>
    </div>
  );
};

export default UserProfilePage;