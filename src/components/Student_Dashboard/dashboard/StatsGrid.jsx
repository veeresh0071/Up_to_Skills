import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Star, TrendingUp } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { useTheme } from "../../../context/ThemeContext";

function StatsGrid({ studentId }) {
  const { darkMode } = useTheme();
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);

  //  Single GLOBAL loading state
  const [loading, setLoading] = useState(true);
  const [loadedParts, setLoadedParts] = useState(0);

  // Helper to count how many API calls finished
  const markLoaded = () => {
    setLoadedParts((prev) => {
      const next = prev + 1;
      if (next === 4) setLoading(false); // All 4 API calls done
      return next;
    });
  };

  // Get student ID
  const effectiveStudentId =
    studentId || localStorage.getItem("id") || localStorage.getItem("studentId");

  // --------------------------------
  // Fetch Enrollments
  // --------------------------------
  useEffect(() => {
    if (!effectiveStudentId) {
      console.warn("StatsGrid: No student ID available");
      setLoading(false);
      return;
    }

    const fetchEnrollment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/enrollments/count/${effectiveStudentId}`
        );
        setEnrolledCount(res.data.count);
      } catch (error) {
        console.error("Error fetching enrollment:", error);
        setEnrolledCount(0);
      } finally {
        markLoaded(); //  added
      }
    };

    fetchEnrollment();
  }, [effectiveStudentId]);

  // --------------------------------
  // Fetch Upcoming Interviews Count + realtime updates
  // --------------------------------
  useEffect(() => {
    if (!effectiveStudentId) return;

    const fetchInterviewCount = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/interviews/count/${effectiveStudentId}`
        );
        setInterviewCount(res.data.count || 0);
      } catch (error) {
        console.error("Error fetching interview count:", error);
        setInterviewCount(0);
      } finally {
        markLoaded();
      }
    };

    fetchInterviewCount();

    const socket = io("http://localhost:5000", {
      auth: {
        role: "student",
        recipientId: effectiveStudentId,
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      // console.log("Socket connected for interview updates");
    });

    // listen to notifications emitted by server
    socket.on("notifications:new", (payload) => {
      if (!payload) return;
      const t = payload.type || payload.notification_type || '';
      if (t === "interview" || t === "interview:reschedule") {
        fetchInterviewCount();
      }
    });

    socket.on("disconnect", () => {
      // console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [effectiveStudentId]);

  // --------------------------------
  // Fetch Projects Count
  // --------------------------------
  useEffect(() => {
    if (!effectiveStudentId) return;

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/projects/assigned/${effectiveStudentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.success && Array.isArray(res.data.data)) {
          setProjectCount(res.data.data.length);
        } else if (Array.isArray(res.data)) {
          setProjectCount(res.data.length);
        } else {
          setProjectCount(0);
        }
      } catch (error) {
        console.error("Error fetching project count:", error);
        setProjectCount(0);
      } finally {
        markLoaded(); 
      }
    };

    fetchProjects();
  }, [effectiveStudentId]);

  // --------------------------------
  // Fetch Skill Badges Count
  // --------------------------------
  useEffect(() => {
    if (!effectiveStudentId) return;

    const fetchBadgeCount = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/skill-badges",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.success && Array.isArray(res.data.data)) {
          setBadgeCount(res.data.data.length);
        } else {
          setBadgeCount(0);
        }
      } catch (error) {
        console.error("Error fetching badge count:", error);
        setBadgeCount(0);
      } finally {
        markLoaded(); 
      }
    };

    fetchBadgeCount();
  }, [effectiveStudentId]);

  // --------------------------------
  // Stats Data
  // --------------------------------
  const stats = [
    {
      title: "Programs Enrolled",
      value: loading ? "..." : enrolledCount,
      icon: CheckCircle,
      color: "primary",
      delay: 0.1,
    },
    {
      title: "My Projects",
      value: loading ? "..." : projectCount,
      icon: Calendar,
      color: "secondary",
      delay: 0.2,
    },
    {
      title: "Upcoming interviews",
      value: loading ? "..." : interviewCount,
      icon: Star,
      color: "accent",
      delay: 0.3,
    },
    {
      title: "Skill Badges Earned",
      value: loading ? "..." : badgeCount,
      icon: TrendingUp,
      color: "success",
      delay: 0.4,
    },
  ];

  const gradientClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600",
    secondary: "bg-gradient-to-r from-orange-500 to-yellow-500",
    accent: "bg-gradient-to-r from-indigo-500 to-purple-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
  };

  if (!effectiveStudentId) {
    return (
      <section className="mb-8">
        <div className={`p-6 rounded-lg border ${darkMode ? "bg-yellow-900/20 border-yellow-800" : "bg-yellow-50 border-yellow-200"}`}>
          <p className={darkMode ? "text-yellow-300" : "text-yellow-800"}>
            ⚠️ Please log in to view your progress statistics.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <motion.h2
        className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Your Progress
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            className={`stat-card p-6 flex items-center gap-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`p-3 rounded-2xl ${gradientClasses[stat.color]}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{stat.value}</div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default StatsGrid;
