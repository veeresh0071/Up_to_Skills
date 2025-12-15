import { motion } from 'framer-motion';
import { Bell, Briefcase, FileText } from 'lucide-react';

function NoticeBoard() {
  // Array of notices with icon, text, and type
  const notices = [
    { icon: Briefcase, text: "Company Hiring - TCS is recruiting!", type: "hiring" },
    { icon: FileText, text: "Active Assessments - React.js Quiz", type: "assessment" },
    { icon: Bell, text: "New Project Assignment Available", type: "project" },
  ];

  return (
    <section className="mb-8">
      {/* Section Title */}
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }} // Initial animation state
        animate={{ opacity: 1, x: 0 }}   // Animate to visible
      >
        Notice Board
      </motion.h2>
      
      {/* Main Notice Card */}
      <motion.div
        className="p-6 rounded-2xl shadow-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header with title and "View All" button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground">Latest Updates</h3>
          <motion.button
            className="text-primary hover:text-primary-glow font-medium"
            whileHover={{ scale: 1.05 }} // Slight scale up on hover
            whileTap={{ scale: 0.95 }}   // Slight scale down on click
          >
            View All
          </motion.button>
        </div>
        
        {/* List of individual notices */}
        <div className="space-y-4">
          {notices.map((notice, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-[#1e293b] hover:bg-gray-200 dark:hover:bg-[#334155] transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -20 }}           // Fade in from left
              animate={{ opacity: 1, x: 0 }}             // Animate to original position
              transition={{ delay: 0.3 + index * 0.1 }}  // Stagger animations
              whileHover={{ x: 4 }}                      // Slight shift on hover
            >
              {/* Icon for notice */}
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-primary/80">
                <notice.icon className="w-5 h-5 text-white" />
              </div>
              {/* Notice text */}
              <span className="font-medium text-foreground">{notice.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default NoticeBoard;
