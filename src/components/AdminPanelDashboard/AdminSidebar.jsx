import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  FolderOpen,
  MessageSquare,
  LogOut,
  X,
  Bell,
  UserCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "mentors", label: "Mentors", icon: Users },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "programs", label: "Programs", icon: BookOpen },
  { id: "assigned_programs", label: "Assign Programs", icon: BookOpen },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
];

export default function AdminSidebar({
  isOpen,
  setIsOpen,
  activeSection,
  setActiveSection,
}) {
  const { darkMode: isDarkMode } = useTheme();
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreen = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(true);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [setIsOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
    if (!isDesktop) setIsOpen(false);
  };

  const handleLogout = () => {
    const lastRole = localStorage.getItem("role") || "admin";
    localStorage.clear();
    // Explicitly remove 'dark' class from html element to ensure consistent theme on login page
    document.documentElement.classList.remove("dark");
    navigate("/login", { state: { role: lastRole } });
  };
  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 z-40 overflow-hidden shadow-2xl transition-colors duration-300
          ${isDarkMode
            ? "bg-gray-900 text-gray-100 border-r border-gray-700"
            : "bg-white text-gray-800 border-r border-gray-200"
          }`}
        initial={{ x: -264 }}
        animate={{ x: isOpen ? 0 : -264 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button (Mobile only) */}
        <AnimatePresence>
          {isOpen && !isDesktop && (
            <motion.button
              className={`absolute top-4 right-4 z-50 p-2 rounded-md transition-colors duration-200 ${isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              onClick={toggleSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <X size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex flex-col h-full pt-16">
          {/* Navigation Items */}
          <nav className="flex-1 pt-6 px-4 overflow-y-auto">
            <div className="space-y-1">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <motion.button
                    key={item.id}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ease-out relative overflow-hidden group
                      ${isActive
                        ? isDarkMode
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-700/40"
                          : "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/40"
                        : isDarkMode
                          ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                          : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                      }`}
                    onClick={() => handleNavigation(item.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    whileHover={{ x: 8, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon
                      className={`w-6 h-6 ${isActive
                          ? "text-gray-800 drop-shadow-md"
                          : isDarkMode
                            ? "text-gray-400 group-hover:text-indigo-400"
                            : "text-gray-600 group-hover:text-primary"
                        }`}
                    />
                    <motion.span
                      className={`font-semibold transition-colors duration-200 ${isActive
                          ? "text-gray-800"
                          : isDarkMode
                            ? "text-gray-300 group-hover:text-white"
                            : "text-gray-700 group-hover:text-gray-900"
                        }`}
                    >
                      {item.label}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className={`p-4 border-t  text-center`}>
            <p className="font-semibold text-sm mb-2 text-gray-400">Connect With Us</p>

            <div className="flex justify-center gap-4 mb-3">
              <FaLinkedin
                size={22}
                className="cursor-pointer hover:text-[#0A66C2]"
                onClick={() =>
                  window.open("https://www.linkedin.com/company/uptoskills/posts/?feedView=all", "_blank")
                }
              />
              <FaInstagram
                size={22}
                className="cursor-pointer hover:text-[#E1306C]"
                onClick={() => window.open("https://www.instagram.com/uptoskills", "_blank")}
              />
              <FaYoutube
                size={22}
                className="cursor-pointer hover:text-[#FF0000]"
                onClick={() =>
                  window.open("https://youtube.com/@uptoskills9101?si=YvRk51dq0exU-zLv", "_blank")
                }
              />
            </div>

            <motion.button
              onClick={handleLogout}
              className={`w-full text-red-500 flex items-center justify-center gap-2 p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-red-50"
                }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}