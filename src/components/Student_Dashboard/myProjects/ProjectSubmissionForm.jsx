import React, { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { toast } from "react-toastify";

function ProjectSubmissionForm({ onProjectAdded }) {
  const { darkMode } = useTheme();
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.id;
  const studentEmail = user?.email;

  const [formData, setFormData] = useState({
    student_email: studentEmail || "",
    title: "",
    description: "",
    tech_stack: "",
    contributions: "",
    is_open_source: false,
    github_pr_link: "",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const openModal = ({ title, message, type = "info" }) => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student_email)
      return openModal({
        title: "Missing Information",
        message: "Student Email is required.",
        type: "error",
      });

    if (!formData.title)
      return openModal({
        title: "Missing Information",
        message: "Project Title is required.",
        type: "error",
      });

    if (!formData.tech_stack)
      return openModal({
        title: "Missing Information",
        message: "Technology Stack is required.",
        type: "error",
      });

    if (!formData.description)
      return openModal({
        title: "Missing Information",
        message: "Project Description is required.",
        type: "error",
      });

    if (!formData.contributions)
      return openModal({
        title: "Missing Information",
        message: "Contributions field is required.",
        type: "error",
      });

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      toast.error("You are not logged in!");
      return openModal({
        title: "Not Logged In",
        message: "Please log in again to submit your project.",
        type: "error",
      });
    }

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...formData,
          student_id: studentId,
        }),
      });

      if (response.ok) {
        const newProject = await response.json();

        // 🎉 SUCCESS TOAST
        toast.success("Project submitted successfully! 🎉");

        openModal({
          title: "Success!",
          message: "Your project has been submitted successfully!",
          type: "success",
        });

        setFormData({
          student_email: studentEmail || "",
          title: "",
          description: "",
          tech_stack: "",
          contributions: "",
          is_open_source: false,
          github_pr_link: "",
        });

        if (onProjectAdded) {
          setTimeout(() => {
            onProjectAdded(newProject.project || newProject);
          }, 1000);
        }
      } else {
        const err = await response.json();

        toast.error("Submission failed ❌");

        openModal({
          title: "Submission Failed",
          message: err.message || "Server error. Please try again later.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);

      toast.error("Network error ❌");

      openModal({
        title: "Network Error",
        message: "Please check your connection and try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full flex justify-center py-10 px-4">
      <div
        className={`w-full max-w-lg min-h-[750px] rounded-2xl p-10 shadow-xl transition-all 
        ${darkMode ? "bg-[#0f1b36] text-white" : "bg-white text-gray-900"}`}
        style={{ border: "1px solid rgba(255,255,255,0.15)" }}
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-400">
          Student Project Submission
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="email"
            name="student_email"
            value={formData.student_email}
            onChange={handleChange}
            placeholder="Student Email"
            className={`w-full px-4 py-3 rounded-lg border 
            ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}`}
          />

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Project Title"
            className={`w-full px-4 py-3 rounded-lg border 
            ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}`}
          />

          <input
            type="text"
            name="tech_stack"
            value={formData.tech_stack}
            onChange={handleChange}
            placeholder="Technology Stack"
            className={`w-full px-4 py-3 rounded-lg border 
            ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}`}
          />

          <input
            type="url"
            name="github_pr_link"
            value={formData.github_pr_link}
            onChange={handleChange}
            placeholder="GitHub PR Link"
            className={`w-full px-4 py-3 rounded-lg border 
            ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}`}
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Project Description"
            className={`w-full px-4 py-3 rounded-lg border resize-none 
            ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}`}
          />

          <textarea
            name="contributions"
            value={formData.contributions}
            onChange={handleChange}
            rows="3"
            placeholder="Your Contributions"
            className={`w-full px-4 py-3 rounded-lg border resize-none 
            ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}`}
          />

          <label className="flex gap-3 items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_open_source"
              checked={formData.is_open_source}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Is this project open-source?</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Submit Project
          </button>
        </form>

        {/* Modal (unchanged) */}
        {modal.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className={`rounded-2xl p-6 max-w-md w-full 
                ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
            >
              <h3 className="text-xl font-bold mb-3">{modal.title}</h3>
              <p className="mb-6">{modal.message}</p>
              <button
                onClick={closeModal}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectSubmissionForm;
