import { motion } from "framer-motion";
import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "../Company_Dashboard/ui/button";
import logo from "../../assets/logo.png";
import darkLogo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import NotificationCenter from "../Notifications/NotificationCenter";
import { useTheme } from "../../context/ThemeContext";

export default function AdminNavbar({ onMenuClick }) {
  const { darkMode: isDarkMode, toggleDarkMode: toggleTheme } = useTheme();
  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-border shadow-xl transition-all duration-300 ${
        isDarkMode ? "bg-gray-900/80 text-white" : "bg-white/60 text-gray-900"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ WebkitBackdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 pb-1">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <motion.button
            aria-label="Toggle sidebar"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:text-black transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
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
                className="object-contain w-36 h-25"
              />
            </Link>
          </motion.div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <NotificationCenter role="admin" />

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
        </div>
      </div>
    </motion.nav>
  );
}
