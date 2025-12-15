import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import Footer from "../dashboard/Footer";
import StudentProfileForm from "./StudentProfileForm";
import DomainsOfInterest from "./DomainsOfInterest";
import { useTheme } from "../../../context/ThemeContext";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { darkMode: isDarkMode } = useTheme();

  const [domainsOfInterest, setDomainsOfInterest] = useState([]);
  const [othersDomain, setOthersDomain] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔔 Popup state (replaces alert)
  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info", // "success" | "error" | "info"
  });

  const openPopup = ({ title, message, type = "info" }) => {
    setPopup({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found. Please login again.");
          setLoading(false);
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const d = res.data.data;

        setFormData({
          full_name: d.profile_full_name || d.student_name,
          contact_number: d.contact_number || d.student_phone,
          linkedin_url: d.linkedin_url || "",
          github_url: d.github_url || "",
          why_hire_me: d.why_hire_me || "",
          ai_skill_summary: d.ai_skill_summary || "",
          profile_completed: d.profile_completed || false,
        });

        setDomainsOfInterest(d.domains_of_interest || []);
        setOthersDomain(d.others_domain || "");
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 404) {
          setError("Profile not found. Please complete your profile.");
        } else if (err.request) {
          setError("Cannot connect to server. Please check your connection.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleDomainChange = (domain, value) => {
    if (domain === "others") {
      setOthersDomain(value);
    } else {
      setDomainsOfInterest((prev) => {
        if (value && !prev.includes(domain)) return [...prev, domain];
        if (!value) return prev.filter((d) => d !== domain);
        return prev;
      });
    }
  };

  const handleFormSubmit = async (formValues) => {
    const fullData = { ...formValues, domainsOfInterest, othersDomain };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        openPopup({
          title: "Session Expired",
          message: "Session expired. Please login again.",
          type: "error",
        });
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fullData),
      });

      const result = await response.json();

      if (response.status === 401) {
        openPopup({
          title: "Session Expired",
          message: "Session expired. Please login again.",
          type: "error",
        });
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (result.success) {
        openPopup({
          title: "Success",
          message: "Profile saved successfully!",
          type: "success",
        });
      } else {
        openPopup({
          title: "Error",
          message: `Error saving profile: ${result.message}\nDetails: ${result.error}`,
          type: "error",
        });
      }
    } catch (error) {
      openPopup({
        title: "Network Error",
        message: "Network error: Could not connect to server",
        type: "error",
      });
    }
  };

  // Helper to style popup header based on type
  const getPopupAccentClasses = () => {
    switch (popup.type) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      default:
        return "border-blue-500";
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "lg:ml-64" : "ml-0"}`}>
        <Header onMenuClick={toggleSidebar} />

        <div className="flex-1 overflow-y-auto pt-24 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Profile</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <StudentProfileForm
                    formData={formData || {}}
                    setFormData={setFormData}
                    onSubmit={handleFormSubmit}
                    isDarkMode={isDarkMode}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <DomainsOfInterest
                    selectedDomains={domainsOfInterest}
                    onChange={handleDomainChange}
                    othersValue={othersDomain}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* 🔔 Centered Popup Modal (replaces alert) */}
      {popup.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 border-t-4 ${getPopupAccentClasses()}`}>
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {popup.title || "Message"}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
              {popup.message}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closePopup}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
