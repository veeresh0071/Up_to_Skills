import React from "react";
import { useTheme } from "../../../context/ThemeContext";

// Footer component definition
const Footer = () => {

     // Accessing the darkMode value from the ThemeContext
    const { darkMode } = useTheme();
    
    return (
        <footer
      className={`w-full text-center py-4 text-sm transition-colors duration-300 border-t ${darkMode ? "bg-gray-900 text-gray-300 border-gray-700" : "bg-gray-100 text-gray-700 border-gray-300"}`}
    >
      <p>© 2025 Uptoskills. Built by learners.</p>
    </footer>
    );
};

// Exporting the Footer component for use in other parts of the app
export default Footer;
