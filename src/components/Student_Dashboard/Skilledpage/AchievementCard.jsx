import React from 'react';
import { FaTrophy, FaCertificate, FaRegCheckCircle, FaClipboardCheck, FaCode, FaUsers, FaLightbulb, FaUserGraduate } from 'react-icons/fa';

/**
 * A highly-styled component to display a single Skill Badge as an achievement,
 * revealing the description only on hover.
 */
const AchievementCard = ({ id, name, description, isVerified, fullName, awardedAt }) => {

    // --- 1. Define Unique Styles for Each Badge Type ---
    const badgeStyles = (badgeName) => {
        switch (badgeName) {
            case 'Best Intern of the Week':
                return {
                    Icon: FaTrophy,
                    mainColor: 'text-yellow-500',
                    bgColor: 'bg-yellow-50 dark:bg-gray-800',
                    borderColor: 'border-yellow-400',
                    shadowColor: 'shadow-xl shadow-yellow-500/50',
                    ribbon: 'from-yellow-400 via-yellow-200 to-yellow-400',
                };
            case 'Project Completion':
                return {
                    Icon: FaClipboardCheck,
                    mainColor: 'text-green-600',
                    bgColor: 'bg-green-50 dark:bg-gray-800',
                    borderColor: 'border-green-500',
                    shadowColor: 'shadow-xl shadow-green-500/50',
                    ribbon: 'from-green-600 via-green-400 to-green-600',
                };
            case 'Code Quality Award':
                return {
                    Icon: FaCode,
                    mainColor: 'text-blue-600',
                    bgColor: 'bg-blue-50 dark:bg-gray-800',
                    borderColor: 'border-blue-500',
                    shadowColor: 'shadow-xl shadow-blue-500/50',
                    ribbon: 'from-blue-600 via-blue-400 to-blue-600',
                };
            case 'Teamwork Excellence':
                return {
                    Icon: FaUsers,
                    mainColor: 'text-pink-600',
                    bgColor: 'bg-pink-50 dark:bg-gray-800',
                    borderColor: 'border-pink-500',
                    shadowColor: 'shadow-xl shadow-pink-500/50',
                    ribbon: 'from-pink-600 via-pink-400 to-pink-600',
                };
            case 'Innovation Champion':
                return {
                    Icon: FaLightbulb,
                    mainColor: 'text-red-500',
                    bgColor: 'bg-red-50 dark:bg-gray-800',
                    borderColor: 'border-red-500',
                    shadowColor: 'shadow-xl shadow-red-500/50',
                    ribbon: 'from-red-500 via-red-300 to-red-500',
                };
            case 'Mentorship Star':
                return {
                    Icon: FaUserGraduate,
                    mainColor: 'text-indigo-600',
                    bgColor: 'bg-indigo-50 dark:bg-gray-800',
                    borderColor: 'border-indigo-500',
                    shadowColor: 'shadow-xl shadow-indigo-500/50',
                    ribbon: 'from-indigo-600 via-indigo-400 to-indigo-600',
                };
            default:
                return { // Default fallback style
                    Icon: FaCertificate,
                    mainColor: 'text-gray-500',
                    bgColor: 'bg-white dark:bg-gray-800',
                    borderColor: 'border-gray-400',
                    shadowColor: 'shadow-lg shadow-gray-500/30',
                    ribbon: 'from-gray-400 via-gray-200 to-gray-400',
                };
        }
    };

    const styles = badgeStyles(name);
    const AchievementIcon = styles.Icon; // Destructure the Icon component

    // Dynamic verification badge color
    const verificationBg = isVerified ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-400 dark:bg-gray-500';
    const verificationText = isVerified ? 'text-white' : 'text-white';

    const formattedDate = new Date(awardedAt).toLocaleDateString("en-IN", {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return (
        <div 
            // 2. Remove pt-2 from the container and the ribbon to remove the gap
            className={`
                group ${styles.bgColor} p-6 border-4 rounded-xl text-center transition-all duration-500 transform 
                hover:scale-[1.05] ${styles.borderColor} ${styles.shadowColor} relative overflow-hidden cursor-pointer
            `}
            style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)' 
            }}
        >
            
            {/* Background Ribbons/Accents - No top padding here now */}
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${styles.ribbon}`}></div>

            {/* Main Achievement Icon */}
            {/* 3. Removed pt-2 and changed the icon class to use the dynamic color */}
            <div className="mb-4 mt-2"> 
                <AchievementIcon className={`mx-auto text-6xl ${styles.mainColor} transition-transform duration-500 group-hover:scale-110`} />
            </div>

            {/* Badge Name */}
            <h2 className="text-xl font-extrabold uppercase mb-2 dark:text-white text-gray-800 tracking-wider h-12 flex items-center justify-center">
                {name}
            </h2>

            {/* Verification Status Badge (Kept visible always) */}
            <div className="mb-4">
                <span className={`inline-flex items-center px-4 py-1 text-sm font-bold rounded-full ${verificationBg} ${verificationText}`}>
                    <FaRegCheckCircle className="mr-2 text-lg" />
                    {isVerified ? 'VERIFIED' : 'AWARDED'}
                </span>
            </div>

            {/* Badge Description - Hidden and Revealed on Hover */}
            <div className="mt-4 transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100">
                <p className="text-gray-600 dark:text-gray-300 text-sm italic border-t pt-3">
                    {description || 'No specific context provided for this award.'}
                </p>
            </div>
            
            {/* Footer Info (Kept visible always) */}
            <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-3 mt-3">
                <p>Awarded to: <span className="font-semibold text-gray-700 dark:text-gray-200">{fullName}</span></p>
                <p>Date: {formattedDate}</p>
            </div>

        </div>
    );
};

export default AchievementCard;