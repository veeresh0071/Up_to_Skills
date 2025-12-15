import { motion } from "framer-motion";
import { User, Sun, Moon, Menu } from "lucide-react";
import { Button } from "../Company_Dashboard/ui/button";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import darkLogo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import NotificationCenter from "../Notifications/NotificationCenter";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar({ onMenuClick }) {
  const { darkMode: isDarkMode, toggleDarkMode: toggleTheme } = useTheme(); // Theme context
  const navigate = useNavigate(); // Navigation hook

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[9999] border-b border-white/30 bg-white/70 pb-2 text-gray-900 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-white"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ WebkitBackdropFilter: "blur(18px)" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 pb-1">

        {/* Left section: Hamburger Menu and Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger menu button */}
          <motion.button
            aria-label="Toggle sidebar"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
          </motion.button>

          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-1 shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-slate-900/70 dark:ring-slate-800/80"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="w-48 h-16 rounded-xl flex items-center justify-center relative overflow-hidden">
              <img
                src={isDarkMode ? darkLogo : logo} // Switch logo based on theme
                alt="UptoSkill Logo"
                className="object-contain w-full h-full"
              />
            </Link>
          </motion.div>
        </div>

        {/* Right section: Notifications, Theme toggle, User profile */}
        <div className="flex items-center gap-2">
          <NotificationCenter role="company" /> {/* Notification center */}

          {/* Theme toggle button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-black" />
              )}
            </Button>
          </motion.div>

          {/* User profile button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/company-profile")}
            >
              <User className="w-5 h-5 dark:text-white" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
