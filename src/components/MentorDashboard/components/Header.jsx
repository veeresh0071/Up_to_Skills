// Import motion for animations
import { motion } from "framer-motion";
// Import icons
import { User, Sun, Moon, Menu } from "lucide-react";
// For navigation
import { useNavigate } from "react-router-dom";
// Custom UI button
import { Button } from "../../Company_Dashboard/ui/button";
// Logos for light/dark mode
import logo from "../../../assets/logo.png";
import darkLogo from "../../../assets/logo.png";
// Router Link
import { Link } from "react-router-dom";

// Notification icon + panel
import NotificationCenter from "../../Notifications/NotificationCenter";
// Theme context hook (dark/light mode)
import { useTheme } from "../../../context/ThemeContext";
// Header Component
// Contains: sidebar toggle, theme toggle, notifications, user menu
export default function Header({ onMenuClick }) {
   // Router navigation
  const navigate = useNavigate();
  
  // Extract darkMode + function from ThemeContext
  const { darkMode: isDarkMode, toggleDarkMode: toggleTheme } = useTheme();

  // When profile icon clicked → navigate to profile page
  const handleProfileClick = () => navigate("/mentor-dashboard/profile");

  // Menu toggle helper
  const handleMenuClick = () => {
    if (typeof onMenuClick === "function") {
      onMenuClick();
    } else {
      window.dispatchEvent(new CustomEvent("toggleSidebar"));
    }
  };

  return (
     // Navbar UI
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white/60 text-gray-900"
      } backdrop-blur-lg border-b border-border shadow-xl transition-all duration-300`}
            // Initial animation (slide-down)
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
            // Safari/WebKit compatibility for blur
      style={{ WebkitBackdropFilter: "blur(16px)" }}
    >
        {/* Navbar Main Container */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 pb-1">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <motion.button
            aria-label="Toggle sidebar"
            className={`p-2 rounded-md hover:bg-gray-100 ${
              isDarkMode ? "dark:hover:bg-gray-800" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMenuClick}
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="w-48 h-16 rounded-xl flex items-center justify-center relative overflow-hidden">
              <img
                src={isDarkMode ? darkLogo : logo}
                alt="UptoSkill Logo"
                className="object-contain w-full h-full"
              />
            </Link>
          </motion.div>
        </div>

        {/* Search Bar (hidden on small screens) */}
        {/* <div className="hidden md:flex items-center max-w-md w-full mx-4 sm:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search assignments, projects..."
              className="pl-10 w-full"
            />
          </div>
        </div> */}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <NotificationCenter role="mentor" />

          {/* Theme Toggle */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </motion.div>

          {/* User Profile */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
