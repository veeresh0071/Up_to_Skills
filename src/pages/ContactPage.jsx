import React from 'react'

// Importing all sections of the Contact Page
import Contact from '../components/Contact_Page/Contact'
import Faq from '../components/Contact_Page/Faq'
import Chatbot from '../components/Contact_Page/Chatbot'
import Footer from '../components/Contact_Page/Footer'
import Header from '../components/Contact_Page/Header'

// Theme context for Dark/Light mode support
import { useTheme } from '../context/ThemeContext'

const ContactPage = () => {
  // Extracting current theme (darkMode: true/false)
  const { darkMode } = useTheme();

  return (
    // Main Page Wrapper
    // Applies dynamic background based on dark/light theme
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Top Navigation/Header Section */}
      <Header/>

      {/* Spacer to avoid content overlapping with fixed header */}
      <main className="pt-16"></main>

      {/* Contact Form Section */}
      <Contact />

      {/* Frequently Asked Questions Section */}
      <Faq />

      {/* Chatbot Component for user assistance */}
      <Chatbot />

      {/* Footer Section */}
      <Footer/>
    </div>
  )
}

export default ContactPage
