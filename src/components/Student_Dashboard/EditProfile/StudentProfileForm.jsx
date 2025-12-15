import React, { useState, useEffect } from "react";

/* ------------------ VALIDATION POPUP COMPONENT ------------------ */
const ValidationPopup = ({ message, onClose, isDarkMode }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-[90%] max-w-md ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-lg font-bold mb-3">Validation Error</h2>
        <p className="mb-5">{message}</p>

        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-md font-semibold ${
            isDarkMode
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};
/* --------------------------------------------------------------- */

const StudentProfileForm = ({
  formData,
  setFormData,
  onSubmit,
  isDarkMode: propIsDarkMode,
}) => {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    try {
      if (typeof propIsDarkMode !== "undefined") return propIsDarkMode;
      if (typeof window !== "undefined") {
        if (document.documentElement.classList.contains("dark")) return true;
        if (localStorage.getItem("theme") === "dark") return true;
        if (localStorage.getItem("isDarkMode") === "true") return true;
      }
    } catch (e) {}
    return false;
  });

  React.useEffect(() => {
    if (typeof propIsDarkMode !== "undefined") {
      setIsDarkMode(propIsDarkMode);
      return;
    }
    const onStorage = (e) => {
      if (e.key === "theme") setIsDarkMode(e.newValue === "dark");
      if (e.key === "isDarkMode") setIsDarkMode(e.newValue === "true");
    };
    window.addEventListener("storage", onStorage);
    const mo = new MutationObserver(() =>
      setIsDarkMode(
        document.documentElement.classList.contains("dark")
      )
    );
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      window.removeEventListener("storage", onStorage);
      mo.disconnect();
    };
  }, [propIsDarkMode]);

  /* ------------------ VALIDATION POPUP STATE ------------------ */
  const [popupMessage, setPopupMessage] = useState("");
  const showPopup = (msg) => setPopupMessage(msg);
  const closePopup = () => setPopupMessage("");
  /* ----------------------------------------------------------- */

  const [localData, setLocalData] = useState({
    full_name: "",
    contact_number: "",
    linkedin_url: "",
    github_url: "",
    why_hire_me: "",
    profile_completed: false,
    ai_skill_summary: "",
  });

  useEffect(() => {
    if (formData) {
      setLocalData({
        full_name: formData.full_name || "",
        contact_number: formData.contact_number || "",
        linkedin_url: formData.linkedin_url || "",
        github_url: formData.github_url || "",
        why_hire_me: formData.why_hire_me || "",
        profile_completed: formData.profile_completed || false,
        ai_skill_summary: formData.ai_skill_summary || "",
      });
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLocalData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // VALIDATIONS → POPUP
    if (!localData.full_name || !/^[A-Za-z ]+$/.test(localData.full_name)) {
      showPopup("Full name is required and should contain only alphabets.");
      return;
    }
    if (!localData.contact_number || !/^[0-9]{10}$/.test(localData.contact_number)) {
      showPopup("Contact number must be exactly 10 digits.");
      return;
    }
    if (
      localData.linkedin_url &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(localData.linkedin_url)
    ) {
      showPopup("Please enter a valid LinkedIn URL.");
      return;
    }
    if (
      localData.github_url &&
      !/^https?:\/\/(www\.)?github\.com\/.*$/.test(localData.github_url)
    ) {
      showPopup("Please enter a valid GitHub URL.");
      return;
    }
    if (!localData.why_hire_me) {
      showPopup("Please fill in the 'Why Hire Me' section.");
      return;
    }
    if (!localData.ai_skill_summary) {
      showPopup("Please provide your AI skill summary.");
      return;
    }

    onSubmit(localData);
  };

  return (
    <>
      {/* POPUP COMPONENT */}
      <ValidationPopup
        message={popupMessage}
        onClose={closePopup}
        isDarkMode={isDarkMode}
      />

      {/* MAIN FORM */}
      <form
        className={`w-[95%] mx-auto p-6 rounded-lg shadow-md font-sans ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        onSubmit={handleSubmit}
      >
        {/* Full Name */}
        <div className="mb-4">
          <label
            className={`font-semibold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
            htmlFor="full_name"
          >
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={localData.full_name}
            onChange={handleChange}
            placeholder="Enter full name"
            className={`p-2.5 border rounded-md text-sm w-full ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label
            className={`font-semibold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
            htmlFor="contact_number"
          >
            Contact Number
          </label>
          <input
            type="text"
            id="contact_number"
            name="contact_number"
            value={localData.contact_number}
            onChange={handleChange}
            placeholder="Enter contact number"
            className={`p-2.5 border rounded-md text-sm w-full ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          />
        </div>

        {/* LinkedIn */}
        <div className="mb-4">
          <label
            className={`font-semibold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
            htmlFor="linkedin_url"
          >
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin_url"
            name="linkedin_url"
            value={localData.linkedin_url}
            onChange={handleChange}
            placeholder="Enter LinkedIn profile URL"
            className={`p-2.5 border rounded-md text-sm w-full ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          />
        </div>

        {/* GitHub */}
        <div className="mb-4">
          <label
            className={`font-semibold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
            htmlFor="github_url"
          >
            GitHub URL
          </label>
          <input
            type="url"
            id="github_url"
            name="github_url"
            value={localData.github_url}
            onChange={handleChange}
            placeholder="Enter GitHub profile URL"
            className={`p-2.5 border rounded-md text-sm w-full ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          />
        </div>

        {/* Why Hire Me */}
        <div className="mb-4">
          <label
            className={`font-semibold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
            htmlFor="why_hire_me"
          >
            Why Hire Me
          </label>
          <textarea
            id="why_hire_me"
            name="why_hire_me"
            value={localData.why_hire_me}
            onChange={handleChange}
            placeholder="Explain why someone should hire you"
            rows="4"
            className={`p-2.5 border rounded-md text-sm w-full ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          />
        </div>

        {/* Profile Completed */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="profile_completed"
            name="profile_completed"
            checked={localData.profile_completed}
            onChange={handleChange}
            className="mr-2"
          />
          <label
            className={`font-semibold ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
            htmlFor="profile_completed"
          >
            Profile Completed
          </label>
        </div>

        {/* AI Skill Summary */}
        <div className="mb-4">
          <label
            className={`font-semibold mb-2 ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
            htmlFor="ai_skill_summary"
          >
            AI Skill Summary
          </label>
          <textarea
            id="ai_skill_summary"
            name="ai_skill_summary"
            value={localData.ai_skill_summary}
            onChange={handleChange}
            placeholder="Summarize your AI skills"
            rows="4"
            className={`p-2.5 border rounded-md text-sm w-full ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          />
        </div>

        <button
          type="submit"
          className={`py-3 px-5 rounded-md font-bold ${
            isDarkMode
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
        >
          Save Profile
        </button>
      </form>
    </>
  );
};

export default StudentProfileForm;
