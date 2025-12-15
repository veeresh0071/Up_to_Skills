// src/components/Student_Dashboard/myProjects/AddProject.jsx

import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import Footer from '../dashboard/Footer';
import ProjectSubmissionForm from './ProjectSubmissionForm';
import { useTheme } from '../../../context/ThemeContext';
import { motion } from 'framer-motion';

function AddProject() {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const handleProjectAdded = (newProject) => {
    // Optional: Show success message or perform any additional action
    console.log('Project submitted successfully:', newProject);
  };

  return (
    <div className={`flex min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isOpen ? "lg:ml-64" : "ml-0"
      }`}>
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        {/* Page Content */}
        <motion.div 
          className="flex-grow pt-24 px-4 sm:px-6 py-6 md:py-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Page Header Section */}
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
             
              <div className={`mt-4 h-1 w-24 rounded-full ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}></div>
            </motion.div>

            {/* Project Submission Form Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProjectSubmissionForm onProjectAdded={handleProjectAdded} />
            </motion.div>

           
          </div>
        </motion.div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default AddProject;