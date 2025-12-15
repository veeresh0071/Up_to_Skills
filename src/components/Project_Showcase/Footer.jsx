import React from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const Footer = ({ isDarkMode: propIsDarkMode }) => {
  const { darkMode: contextDarkMode } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextDarkMode;
  return (
    <footer className={`py-2 px-3 transition-colors duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-[#2E4053] text-white"}`}>

      {/* Scroll up button*/}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`p-3 rounded-full shadow-lg transition ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-slate-700 hover:bg-transparent text-white"}`}
          aria-label="Scroll to top">
          ↑
        </button>
      </div>

      <p className={`text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}>
        © 2025 Uptoskills. Built by learners.
      </p>
    </footer>
  );
};

export default Footer;
