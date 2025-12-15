// StudentSkillBadgesPage.jsx
import React, { useState, useEffect } from "react"; 
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import Footer from "../dashboard/Footer";
import AchievementCard from "./AchievementCard";
import { useTheme } from "../../../context/ThemeContext";

const StudentSkillBadgesPage = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const { darkMode } = useTheme();
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ------------------------------
    // Sidebar responsive behavior
    // ------------------------------
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 1024;
            setSidebarVisible(!mobile);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // ------------------------------
    // Fetch Skill Badges
    // ------------------------------
    useEffect(() => {
        const fetchBadges = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const token = localStorage.getItem('token'); 
                
                if (!token) {
                    setError("Authentication required. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await fetch("http://localhost:5000/api/skill-badges", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                
                const data = await response.json();

                if (response.ok && data.success) {
                    setBadges(data.data);
                } else {
                    setError(data.message || "Failed to fetch badges");
                }
            } catch (err) {
                console.error("Error fetching badges:", err);
                setError("Network error. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchBadges();
    }, []);

    return (
        <div
            className={`flex min-h-screen transition-all duration-300 ${
                darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
            }`}
        >
            <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />
            
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    isSidebarVisible ? "lg:ml-64" : "ml-0"
                }`}
            >
                <Header
                    onMenuClick={() => setSidebarVisible(!isSidebarVisible)}
                />

                <div className="pt-24 px-4 sm:px-6 py-6 flex-1">
                <h1 className="text-3xl font-bold mb-4 md:mb-8">🎖 Student Skill Badges</h1>
                    {loading ? (
                        <div className="flex justify-center items-center p-10">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                            <p className="ml-4 text-gray-500 dark:text-gray-300">
                                Loading your awesome achievements...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-xl text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    ) : badges.length === 0 ? (
                        <div className="p-10 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
                                No skill badges found. Time to earn some!
                            </p>
                           
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {badges.map((badge) => (
                                <AchievementCard
                                    key={badge.id}
                                    id={badge.id}
                                    name={badge.name}
                                    description={badge.description}
                                    isVerified={badge.is_verified} 
                                    fullName={badge.full_name}
                                    awardedAt={badge.awarded_at}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default StudentSkillBadgesPage;
