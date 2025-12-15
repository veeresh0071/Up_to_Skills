import { motion } from "framer-motion";
import { User, Sun, Moon, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Company_Dashboard/ui/button";
import NotificationCenter from "../../Notifications/NotificationCenter";
import logo from "../../../assets/logo.png";
import darkLogo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate(); // Router navigation hook
  const { darkMode, toggleDarkMode } = useTheme(); // Theme context: dark mode toggle

  // Navigate to user profile page
  const handleProfileClick = () => navigate("/dashboard/profile");

  return (
    <motion.nav
      // Fixed top nav with backdrop blur and transition effects
      className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-b border-border shadow-xl transition-all duration-300"
      initial={{ y: -100 }} // Start hidden above viewport
      animate={{ y: 0 }} // Slide in
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ WebkitBackdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 pb-1">
        
        {/* Left: Hamburger Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Sidebar toggle button */}
          <motion.button
            aria-label="Toggle sidebar"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </motion.button>

          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="w-48 h-16 rounded-xl flex items-center justify-center relative overflow-hidden">
              <img
                src={darkMode ? darkLogo : logo} // Switch logo based on theme
                alt="UptoSkill Logo"
                className="object-contain w-full h-full"
              />
            </Link>
          </motion.div>
        </div>

        {/* Optional Search Bar (commented out) */}
        {/* <div className="hidden md:flex items-center max-w-md w-full mx-4 sm:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search assignments, projects..."
              className="pl-10 w-full"
            />
          </div>
        </div> */}

        {/* Right Actions: Notifications, Dark Mode Toggle, Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications dropdown */}
          <NotificationCenter role="student" />

          {/* Dark Mode Toggle Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" /> // Sun icon for dark mode active
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" /> // Moon icon for light mode
              )}
            </Button>
          </motion.div>

          {/* Profile Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
