import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import logo from "../../assets/logo.png";
import darkLogo from "../../assets/logo.png";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`font-sans fixed w-full z-50 backdrop-blur-lg shadow-sm transition-colors duration-300 ${darkMode ? "bg-gray-800/90" : "bg-white/80"}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" aria-label="Uptoskills Home">
          <img
            src={darkMode ? darkLogo : logo}
            alt="Uptoskills Logo"
            className="h-16 w-48 transition-transform hover:scale-110"
          />
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <nav className={`flex space-x-6 font-medium text-sm ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {["Home", "About", "Programs", "Contact"].map((link, i) => {
              const path =
                link.toLowerCase() === "home" ? "/" : `/${link.toLowerCase()}`;
              return (
                <Link
                  key={i}
                  to={path}
                  className="relative group hover:text-[#00BDA6]"
                >
                  {link}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#00BDA6] group-hover:w-full transition-all duration-300" />
                </Link>
              );
            })}
          </nav>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
