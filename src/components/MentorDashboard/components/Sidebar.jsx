// React imports
import React, { useEffect, useState, useRef } from "react";

// For smooth animations
import { motion } from "framer-motion";
// For navigation inside React Router
import { useNavigate, useLocation } from "react-router-dom";

// Icons
import {
  Home,
  Users,
  LogOut,
  Edit3,
  Award,
  Info,
  BookOpen,
} from "lucide-react";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
// Custom Theme context
import { useTheme } from "../../../context/ThemeContext";

// Sidebar Menu Items
const sidebarItems = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/mentor-dashboard" },
  {
    name: "My Programs",
    icon: <BookOpen size={18} />,
    path: "/mentor-dashboard/assigned-programs",
  },
  {
    name: "Students",
    icon: <Users size={18} />,
    path: "/mentor-dashboard/multi-student",
  },
  // { name: "Projects", icon: <Folder size={18} />, path: "/mentor-dashboard/open-source-contributions" },
  {
    name: "Edit Profile",
    icon: <Edit3 size={18} />,
    path: "/mentor-dashboard/edit-profile",
  },
  {
    name: "Skill Badges",
    icon: <Award size={18} />,
    path: "/mentor-dashboard/skill-badges",
  },
  // { name: "Project Showcase", icon: <Folder size={18} />, path: "/mentor-dashboard/project-showcase" },
  {
    name: "About Us",
    icon: <Info size={18} />,
    path: "/mentor-dashboard/AboutUs",
  },
];

const Sidebar = ({
  children,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // theme state from context
  const { darkMode: isDarkMode } = useTheme();
  // Active selected menu item
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Internal state if parent does not control sidebar open/close
  const [internalOpen, setInternalOpen] = useState(true);
  // Detecting desktop screen width
  const [isDesktop, setIsDesktop] = useState(false);
  // Check if sidebar state is controlled by parent
  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  // Handle screen size changes
  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      // On desktop, sidebar is always open (if not controlled)
      if (desktop && !isControlled) setInternalOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [isControlled]);

  //  Helper function to change sidebar open/close state
  //  * Works for both controlled + uncontrolled mode
  const setOpen = (v) => {
    if (isControlled) {
      if (typeof controlledSetIsOpen === "function") controlledSetIsOpen(v);
    } else {
      setInternalOpen(v);
    }
  };

  //  Highlight active route
  useEffect(() => {
    const currentItem =
      sidebarItems.find((item) => location.pathname === item.path) ||
      sidebarItems.find((item) => location.pathname.startsWith(item.path));
    if (currentItem) setActiveItem(currentItem.name);
  }, [location.pathname]);

  // Sidebar toggle handler
  const toggleHandlerRef = useRef();
  useEffect(() => {
    toggleHandlerRef.current = () => setOpen(!isOpen);
  }, [isOpen]);
  useEffect(() => {
    const handler = () =>
      toggleHandlerRef.current && toggleHandlerRef.current();
    window.addEventListener("toggleSidebar", handler);
    return () => window.removeEventListener("toggleSidebar", handler);
  }, []);

  // clears user session and redirects to login
  const handleLogout = () => {
    const lastRole = localStorage.getItem("role") || "mentor";
    localStorage.clear();
    navigate("/login", { state: { role: lastRole } });
  };

  // navigate & scroll to contact section
  const handleAboutUs = () => {
    navigate("/mentor-dashboard/AboutUs");
    setTimeout(() => {
      const el = document.getElementById("contact-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  // ✅ Dynamic theme styles
  const bgColor = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const activeBg = isDarkMode
    ? "bg-gray-700 text-white"
    : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-xl shadow-blue-400/30";
  const logoutHoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-red-50";

  return (
    <>
      {/* SIDEBAR PANEL */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 shadow-2xl z-40 overflow-hidden transition-colors duration-300 ${bgColor}`}
        initial={{ x: -264 }}
        animate={{ x: isOpen ? 0 : -264 }}
        transition={{ duration: 0.28 }}
      >
        <div className="flex flex-col h-full pt-16 justify-between">
          {/* ------------------ MENU SECTION ------------------ */}
          <div>
            <nav className="flex-1 pt-6 px-4">
              <div className="space-y-2">
                {/* Loop through sidebar items */}
                {sidebarItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 ease-out relative ${
                      activeItem === item.name ? activeBg : hoverBg
                    }`}
                    onClick={() => {
                      setActiveItem(item.name);
                      if (item.name === "About Us") handleAboutUs();
                      else navigate(item.path);
                      if (!isDesktop) setOpen(false);
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.02,
                      duration: 0.22,
                      ease: "easeOut",
                    }}
                    whileHover={{ x: 6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Icon */}
                    <div className="flex items-center">{item.icon}</div>
                    {/* Menu text */}
                    <span className="font-semibold">{item.name}</span>
                  </motion.button>
                ))}
              </div>
            </nav>
          </div>

          {/* ✅ Footer Section */}
          <div
            className={`p-4 border-t ${borderColor} text-center transition-colors duration-300`}
          >
            <p className="font-semibold text-sm mb-2 text-gray-500">
              Connect With Us
            </p>
            {/* Social icons */}
            <div className="flex justify-center gap-4 mb-3">
              <FaLinkedin
                size={22}
                className="cursor-pointer hover:text-[#0A66C2] transition"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/company/uptoskills/posts/?feedView=all",
                    "_blank"
                  )
                }
              />
              <FaInstagram
                size={22}
                className="cursor-pointer hover:text-[#E1306C] transition"
                onClick={() =>
                  window.open("https://www.instagram.com/uptoskills", "_blank")
                }
              />
              <FaYoutube
                size={22}
                className="cursor-pointer hover:text-[#FF0000] transition"
                onClick={() =>
                  window.open(
                    "https://youtube.com/@uptoskills9101?si=YvRk51dq0exU-zLv",
                    "_blank"
                  )
                }
              />
            </div>

            {/* Logout button */}

            <motion.button
              onClick={handleLogout}
              className={`w-full text-red-500 ${logoutHoverBg} flex items-center justify-center gap-2 p-2 rounded-lg transition-all`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* MAIN CONTENT ON RIGHT SIDE */}

      <div
        className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-0"}
        } ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
      >
        {children}
      </div>
    </>
  );
};

export default Sidebar;
