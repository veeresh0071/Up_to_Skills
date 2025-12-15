// Importing  React hooks and libraries
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Importing UI Components
import Sidebar from "../../MentorDashboard/components/Sidebar";
import Header from "../../MentorDashboard/components/Header";
import Footer from "../../MentorDashboard/components/Footer";

// Toast messages for success/error alerts
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Predefined domain list for mentors
const predefinedDomains = [
  "AI & Machine Learning",
  "Data Science",
  "Web Development",
  "App Development",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "UI/UX Design",
  "DevOps",
];

// Main Component
const MentorEditProfilePage = ({ isDarkMode, setIsDarkMode }) => {

  // Sidebar state (open/close)
  const [isOpen, setIsOpen] = useState(true);

  // Loading states
  const [loading, setLoading] = useState(true);

  // Saving state when submitting profile changes
  const [saving, setSaving] = useState(false);

  // Confirmation popup visibility
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Local form state
  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    linkedin_url: "",
    github_url: "",
    about_me: "",
    expertise_domains: [],
    others_domain: "",
  });

  // Getting token from localStorage to authenticate API calls
  const token = localStorage.getItem("token");

  // Fetch mentor profile from backend
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/mentor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data || {};

      // Set form data from backend response
      setFormData({
        full_name: data.profile_full_name || data.full_name || "",
        contact_number: data.contact_number || "",
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
        about_me: data.about_me || "",
        expertise_domains: data.expertise_domains || [],
        others_domain: data.others_domain || "",
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to load mentor profile.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Save profile to backend (after confirmation)
  const saveProfile = async () => {
    try {
      setSaving(true);
      setShowConfirmation(false);

      // Cleaned payload to send
      const payload = {
        full_name: (formData.full_name || '').trim(),
        contact_number: (formData.contact_number || '').trim(),
        linkedin_url: (formData.linkedin_url || '').trim(),
        github_url: (formData.github_url || '').trim(),
        about_me: (formData.about_me || '').trim(),
        expertise_domains: Array.isArray(formData.expertise_domains)
          ? formData.expertise_domains
          : [],
        others_domain: (formData.others_domain || '').trim(),
      };

      console.log("Sending mentor profile payload:", payload);

      // API call to update profile
      const res = await axios.post(
        "http://localhost:5000/api/mentor/profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Mentor profile response:", res.data);

      // Show success or failure message
      if (res.data?.success) {
        toast.success("Profile updated successfully!");
        fetchProfile(); // Refresh UI
      } else {
        toast.error(res.data?.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(
        "Mentor profile save error:",
        err.response?.data || err.message
      );
      toast.error(
        err.response?.data?.message || "Network error while saving profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle simple input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Spread previous formData and update only changed field
    setFormData({ ...formData, [name]: value });
  };

  // Toggle domains from predefined list
  const handleDomainToggle = (domain) => {
    const exists = formData.expertise_domains.includes(domain);

    setFormData({
      ...formData,
      expertise_domains: exists
        ? formData.expertise_domains.filter((d) => d !== domain) // Remove selected domain
        : [...formData.expertise_domains, domain], // Add selected domain
    });
  };

  // Show confirmation modal when clicking save
  const handleSaveButtonClick = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => saveProfile();
  const handleCancelConfirm = () => setShowConfirmation(false);

  // Profile is considered "Completed" only if all required fields are filled
  const isProfileCompleted =
    formData.full_name &&
    formData.contact_number &&
    formData.linkedin_url &&
    formData.github_url &&
    formData.about_me &&
    formData.expertise_domains &&
    formData.expertise_domains.length > 0
      ? "Yes"
      : "No";

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col transition-all duration-300">

        {/* Header / Top Navigation */}
        <Header
          onMenuClick={() => setIsOpen(!isOpen)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 pt-16 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">

            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={3000} newestOnTop style={{ zIndex: 99999 }} />

            {/* Page Title */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Mentor Profile
              </h2>
              {/* Saving indicator */}
              {saving && (
                <span className="text-sm text-gray-500 dark:text-gray-300 italic">
                  Saving...
                </span>
              )}
            </div>

            {/* Loading animation while fetching */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (

              // Form Start
              <form className="space-y-6" onSubmit={handleSaveButtonClick}>

                {/* Grid for two-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium dark:text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium dark:text-white">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleChange}
                      placeholder="Enter your 10-digit phone number"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* LinkedIn URL */}
                  <div>
                    <label className="block text-sm font-medium dark:text-white">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {/* GitHub URL */}
                  <div>
                    <label className="block text-sm font-medium dark:text-white">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {/* About Me */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium dark:text-white">
                      About Me
                    </label>
                    <textarea
                      name="about_me"
                      value={formData.about_me}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Write a short bio about yourself"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Expertise Domains */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 dark:text-white">
                    Expertise Domains
                  </h3>

                  {/* Domain Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {predefinedDomains.map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => handleDomainToggle(domain)}
                        className={`px-4 py-2 rounded-full border transition ${
                          formData.expertise_domains.includes(domain)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 dark:bg-gray-700 dark:text-white"
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>

                  {/* Custom Domain Input */}
                  <input
                    type="text"
                    name="others_domain"
                    value={formData.others_domain}
                    onChange={handleChange}
                    placeholder="Add a custom domain..."
                    className="w-full mt-4 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Profile completion + Save Button */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-white">
                    Profile Completed: {isProfileCompleted}
                  </span>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">

          <div
            className={`rounded-lg shadow-2xl p-6 max-w-sm w-full transform transition-all ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Warning Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl">⚠️</div>
            </div>

            {/* Title */}
            <h3
              className={`text-xl font-semibold text-center mb-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Confirm Profile Update
            </h3>

            {/* Confirmation Details */}
            <div
              className={`mb-6 p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-sm mb-3 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <strong>Name:</strong> {formData.full_name || "Not provided"}
              </p>

              <p
                className={`text-sm mb-3 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <strong>Contact:</strong> {formData.contact_number || "Not provided"}
              </p>

              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <strong>Domains:</strong>{" "}
                {formData.expertise_domains.length > 0
                  ? formData.expertise_domains.join(", ")
                  : "Not provided"}
              </p>
            </div>

            {/* Confirmation Message */}
            <p
              className={`text-center text-sm mb-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Are you sure you want to save these changes?
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelConfirm}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmSave}
                className="px-6 py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 transition"
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorEditProfilePage;
