// Importing React and its hooks
import React, { useEffect, useState } from "react";
// Axios for making API requests
import axios from "axios";
// Sidebar and Header components
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Header from "./Header";

// MentorProfilePage Component
// Displays profile data of mentor (fetched using token)
const MentorProfilePage = ({ isDarkMode, setIsDarkMode }) => {
  // Sidebar open/close state
  const [isOpen, setIsOpen] = useState(true);

  // Stores fetched mentor profile data
  const [userData, setUserData] = useState(null);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Toggles sidebar visibility
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Fetch mentor profile data when page loads (useEffect runs once)
  useEffect(() => {
    // Fetch mentor profile from backend
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }
        // Get user details stored locally (fallbacks)

        // Fetch stored basic user details
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        const storedUsername = localStorage.getItem("username");

        // API call for mentor profile
        const res = await axios.get("http://localhost:5000/api/mentor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const d = res.data?.data || {};

        console.log("Fetched mentor profile data:", d);

        // Check if profile is complete
        const isProfileComplete =
          (d.profile_full_name || d.mentor_name || "").trim() !== "" &&
          (d.contact_number || "").trim() !== "" &&
          Array.isArray(d.expertise_domains) &&
          d.expertise_domains.length > 0 &&
          (d.mentor_email || "").trim() !== "";

        // Build final user object
        const newUserData = {
          username:
            d.username ||
            d.mentor_username ||
            d.user_name ||
            storedUser.username ||
            storedUsername ||
            "",

          email: d.mentor_email || storedUser.email || "",
          full_name: d.profile_full_name || d.mentor_name || storedUser.name || "",
          contact_number: d.contact_number || "",
          linkedin_url: d.linkedin_url || "",
          github_url: d.github_url || "",
          domains_of_interest: Array.isArray(d.expertise_domains)
            ? d.expertise_domains
            : [],
          others_domain: d.others_domain || "",
          profile_completed: Boolean(isProfileComplete),
        };

        console.log("Setting user data:", newUserData);

        setUserData(newUserData);
      } catch (err) {
        console.error("Error fetching mentor profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false); // Hide loader
      }
    };

    // Initial call on component mount
    fetchProfile();

    // Refresh data when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchProfile();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Cleanup on unmount
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <div className={`flex min-h-screen bg-gray-50 dark:bg-gray-900`}>
      
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />

      {/* Main Section */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "" : "ml-20"}`}>
        
        {/* Header */}
        <Header
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        {/* Main Content Area */}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-6xl mx-auto">
            
            <h1 className="text-2xl font-bold mb-6 mt-12 text-gray-800 dark:text-white">
              Your Profile
            </h1>
            {/* Loader */}

            {/* Loading, Error & Data Rendering */}
            {loading && <p className="text-gray-600 dark:text-gray-400">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* User Profile Info */}
            {!loading && userData && (
              <>
                {/* Account Info Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Account Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Email" value={userData.email} />
                  </div>
                </div>

                {/* Profile Info Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Left: Personal Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                      Personal Information
                    </h2>

                    <div className="space-y-4">
                      <Info label="Username" value={userData.username} />
                      <Info label="Full Name" value={userData.full_name} />
                      <Info label="Contact Number" value={userData.contact_number} />
                      <LinkInfo label="LinkedIn URL" url={userData.linkedin_url} />
                      <LinkInfo label="GitHub URL" url={userData.github_url} />
                      <Info
                        label="Profile Completed"
                        value={userData.profile_completed ? "Yes" : "No"}
                      />
                    </div>
                  </div>

                  {/* Right: Domains */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                      Expertise Domains
                    </h2>

                    <div className="space-y-3">
                      {userData.domains_of_interest?.map((domain, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-gray-800 dark:text-white">
                            {domain}
                          </span>
                        </div>
                      ))}

                      {/* Custom domain */}
                      {userData.others_domain && (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-gray-800 dark:text-white">
                            Others: {userData.others_domain}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Edit Button */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() =>
                          (window.location.href = "/mentor-dashboard/edit-profile")
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        </main>
         <Footer/>
      </div>
    </div>
  );
};

// Info text component
const Info = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </label>
    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
      {value || "—"}
    </p>
  </div>
);

// Link component for GitHub/LinkedIn
const LinkInfo = ({ label, url }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </label>

    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        {url}
      </a>
    ) : (
      <p className="text-gray-800 dark:text-white">—</p>
    )}
  </div>
);

export default MentorProfilePage;
