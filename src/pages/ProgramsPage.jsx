import React from 'react';

// Page Components
import ProgramsSection from '../components/AboutPage/ProgramsSection';
import Header from '../components/AboutPage/Header';
import Chatbot from '../components/Contact_Page/Chatbot';

// Theme context (handles dark/light mode styling)
import { useTheme } from '../context/ThemeContext';

/*
  =====================================================================
    PROGRAMS PAGE
    -------------------------------------------------------------------
    • Shows the list of programs offered by Uptoskills.
    • Includes a reusable Header, ProgramsSection content, Footer,
      and global Chatbot.
    • Supports dark mode through ThemeContext.
  =====================================================================
*/
const ProgramsPage = () => {
  const { darkMode } = useTheme(); // Get current theme mode

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* ------------------------ PAGE HEADER ------------------------ */}
      <Header />

      {/* ------------------------ MAIN CONTENT ------------------------ */}
      <main className='flex-grow'>
        <ProgramsSection />
      </main>

      {/* ------------------------ FOOTER SECTION ------------------------ */}
      <footer
        className={`w-full text-center py-4 text-sm transition-colors duration-300 border-t ${
          darkMode
            ? "bg-gray-950 text-gray-300 border-gray-700"
            : "bg-gray-700 text-gray-100 border-gray-300"
        }`}
      >
        <p>© 2025 Uptoskills. Built by learners.</p>
      </footer>

      {/* ------------------------ GLOBAL CHATBOT ------------------------ */}
      <Chatbot />
    </div>
  );
};

export default ProgramsPage;
