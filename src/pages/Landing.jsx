// // src/pages/Landing.jsx

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Chatbot from "../components/Contact_Page/Chatbot";
// import logo from "../assets/logo.png";

// export default function Landing() {
//   const navigate = useNavigate();

//   // Get user from localStorage
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   // Track selected role (default student)
//   const [selectedRole, setSelectedRole] = useState("student");

//   // Handle role-based navigation
//   const handleNavigation = (role) => {
//     if (user) {
//       const userRole = user.role?.toLowerCase();

//       // Student/Learner → Dashboard
//       if (role === "learner" && (userRole === "student" || userRole === "learner")) {
//         navigate("/dashboard");
//         return;
//       }

//       // Company → Company Dashboard
//       if (role === "company" && userRole === "company") {
//         navigate("/company");
//         return;
//       }

//       // Mentor → Mentor Dashboard
//       if (role === "mentor" && userRole === "mentor") {
//         navigate("/mentor-dashboard");
//         return;
//       }
//     }

//     // If user not logged in, redirect to login with role pre-selected
//     let loginRole = "student";
//     if (role === "company") loginRole = "company";
//     else if (role === "mentor") loginRole = "mentor";
//     else if (role === "learner") loginRole = "student";

//     setSelectedRole(loginRole);
//     navigate("/login", { state: { role: loginRole } });
//   };

//   // Dropdown handler
//   const handleRoleChange = (e) => {
//     const role = e.target.value;
//     setSelectedRole(role);
//     navigate("/login", { state: { role } });
//   };

//   const features = [
//     {
//       title: "For Learners",
//       icon: "https://static.thenounproject.com/png/7914064-512.png",
//       desc: "Sharpen your tech skills with projects and peer sessions.",
//       role: "learner",
//     },
//     {
//       title: "For Companies",
//       icon: "https://cdn-icons-png.flaticon.com/512/2858/2858749.png",
//       desc: "Hire pre-vetted, job-ready talent from our community.",
//       role: "company",
//     },
//     {
//       title: "For Mentors",
//       icon: "https://cdn-icons-png.flaticon.com/512/3159/3159980.png",
//       desc: "Provide guidance and mentorship opportunities.",
//       role: "mentor",
//     },
//   ];

//   return (
//     <div className="font-sans bg-white text-gray-900 overflow-x-hidden">
//       {/* Header */}
//       <header className="fixed w-full z-50 bg-white/80 backdrop-blur-lg shadow-sm transition">
//         <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
//           <img
//             src={logo}
//             alt="Upto To Skills logo"          
//             className="h-12 transition-transform hover:scale-110 cursor-pointer"
//             onClick={() => navigate("/")}
//           />
//           <nav className="flex space-x-6 font-medium text-gray-800 text-sm">
//             {["Home", "About", "Programs", "Contact"].map((link, i) => {
//               const path = link.toLowerCase() === "home" ? "/" : `/${link.toLowerCase()}`;
//               return (
//                 <span
//                   key={i}
//                   className="relative group hover:text-[#00BDA6] cursor-pointer"
//                   onClick={() => navigate(path)}
//                 >
//                   {link}
//                   <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#00BDA6] group-hover:w-full transition-all duration-300" />
//                 </span>
//               );
//             })}
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="pt-32 md:pt-44 pb-20 px-6 md:px-16 bg-gradient-to-br from-[#e0fdf4] via-[#f7fffe] to-[#c1f6e8] relative overflow-hidden">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -40 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1 }}
//           >
//             <h1 className="text-4xl md:text-5xl font-extrabold text-[#00BDA6] leading-tight mb-6">
//               Learn. Connect. <br /> Grow with Peers.
//             </h1>
//             <p className="text-gray-600 text-lg mb-6">
//               Collaborate with passionate learners and build real-world tech skills through projects.
//             </p>

//             {/* Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button
//                 className="bg-gradient-to-r from-[#00BDA6] to-[#1BBC9B] hover:from-[#f97316] hover:to-[#fb923c] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-500 w-full sm:w-auto"
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </button>
//               <button
//                 className="bg-gradient-to-r from-[#f97316] to-[#fb923c] hover:from-[#00BDA6] hover:to-[#1BBC9B] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-500 w-full sm:w-auto"
//                 onClick={() => navigate("/register")}
//               >
//                 Register
//               </button>
//             </div>
//           </motion.div>

//           {/* Animated Illustrations */}
//           <div className="relative flex justify-center items-center">
//             <motion.img
//               src="https://img.freepik.com/free-vector/online-world-concept-illustration_114360-1206.jpg"
//               alt="Main Hero"
//               className="w-72 md:w-80 rounded-xl shadow-2xl z-10"
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.3, duration: 0.9 }}
//             />
//             <motion.img
//               src="https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg"
//               alt="Secondary Hero"
//               className="absolute top-[-40px] right-[-30px] w-40 md:w-48 shadow-xl rounded-lg z-0 opacity-80"
//               initial={{ scale: 0.9, rotate: -5, opacity: 0 }}
//               animate={{ scale: 1, rotate: 0, opacity: 1 }}
//               transition={{ delay: 0.6, duration: 1 }}
//             />
//             <motion.img
//               src="https://img.freepik.com/free-vector/college-project-concept-illustration_114360-7793.jpg"
//               alt="Floating Hero"
//               className="absolute bottom-[-30px] left-[-30px] w-36 md:w-44 rounded-lg shadow-md opacity-90"
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: [20, 0, 20], opacity: 1 }}
//               transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
//             />
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 px-6 md:px-16 bg-white text-center">
//         <h2 className="text-3xl font-bold text-gray-800 mb-10">What We Offer</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {features.map((box, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.06 }}
//               onClick={() => handleNavigation(box.role)}
//               className="cursor-pointer text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform transition
//                 bg-gradient-to-br from-[#00BDA6] to-[#1BBC9B]
//                 hover:from-[#f97316] hover:to-[#fb923c]"
//             >
//               <img
//                 src={box.icon}
//                 alt={box.title}
//                 className="h-14 mx-auto mb-4 bg-white p-2 rounded-full shadow-md"
//               />
//               <h3 className="text-xl font-semibold mb-2">{box.title}</h3>
//               <p className="text-sm">{box.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Partners */}
//       <section className="py-16 bg-[#f9f9f9] text-center">
//         <h3 className="text-2xl font-bold text-gray-800 mb-8">
//           Trusted by Top Companies
//         </h3>
//         <div className="flex flex-wrap justify-center items-center gap-10">
//           {[
//             "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tata.svg",
//             "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/infosys.svg",
//             "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
//             "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
//           ].map((logo, i) => (
//             <motion.img
//               key={i}
//               src={logo}
//               alt="partner"
//               className="h-10 grayscale hover:grayscale-0 transition duration-300"
//             />
//           ))}
//         </div>
//       </section>




//       {/* Footer */}
//       <footer className="bg-gray-900 text-white text-center py-6 text-sm">
//         <p>©2025 Uptoskills. Built by learners.</p>
//       </footer>

//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// }

// src/pages/Landing.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

import Chatbot from "../components/Contact_Page/Chatbot";
import logo from "../assets/logo.png";
import darkLogo from "../assets/logo.png";

// Global theme provider for Dark/Light mode
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
  const navigate = useNavigate();

  // Theme context → provides global darkMode + toggleDarkMode
  const { darkMode, toggleDarkMode } = useTheme();

  // Fetch logged-in user from localStorage to enable role-based redirects
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Tracks the selected role during navigation (student/company/mentor)
  const [selectedRole, setSelectedRole] = useState("student");

  // ----------------------------------------------
  // ROLE-BASED NAVIGATION LOGIC
  // Helps redirect users to the correct dashboard 
  // depending on their login status + role.
  // ----------------------------------------------
  const handleNavigation = (role) => {
    if (user) {
      const userRole = user.role?.toLowerCase();

      // If logged-in user selects the role they belong to → redirect to dashboard
      if (role === "learner" && (userRole === "student" || userRole === "learner")) {
        navigate("/dashboard");
        return;
      }

      if (role === "company" && userRole === "company") {
        navigate("/company");
        return;
      }

      if (role === "mentor" && userRole === "mentor") {
        navigate("/mentor-dashboard");
        return;
      }
    }

    // If user is NOT logged in → redirect to login with pre-selected role
    let loginRole = "student";
    if (role === "company") loginRole = "company";
    else if (role === "mentor") loginRole = "mentor";
    else if (role === "learner") loginRole = "student";

    setSelectedRole(loginRole);
    navigate("/login", { state: { role: loginRole } });
  };

  // Simple dropdown role selector → moves user to login page
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    navigate("/login", { state: { role } });
  };

  // Landing page feature boxes
  const features = [
    {
      title: "For Learners",
      icon: "https://img.icons8.com/?size=100&id=23319&format=png&color=000000",
      desc: "Sharpen your tech skills with projects and peer sessions.",
      role: "learner",
    },
    {
      title: "For Companies",
      icon: "https://img.icons8.com/?size=100&id=113856&format=png&color=000000",
      desc: "Hire pre-vetted, job-ready talent from our community.",
      role: "company",
    },
    {
      title: "For Mentors",
      icon: "https://img.icons8.com/?size=100&id=mBzT9ySeO_go&format=png&color=000000",
      desc: "Provide guidance and mentorship opportunities.",
      role: "mentor",
    },
  ];

  return (
    <div
      className={`font-sans overflow-x-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* ------------------------------------------------- */}
      {/* HEADER — sticky top bar with logo + navigation + theme toggle */}
      {/* ------------------------------------------------- */}
      <header
        className={`fixed w-full z-50 backdrop-blur-lg shadow-sm transition-colors duration-300 ${
          darkMode ? "bg-gray-800/90" : "bg-white/80"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          {/* Logo switches automatically based on theme */}
          <img
            src={darkMode ? darkLogo : logo}
            alt="Upto To Skills logo"
            className="h-16 transition-transform hover:scale-110 cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* Navigation Links + Theme Toggle */}
          <div className="flex items-center space-x-4">
            <nav
              className={`flex space-x-6 font-medium text-sm ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {/* Dynamic nav links */}
              {["Home", "About", "Programs", "Contact"].map((link, i) => {
                const path = link.toLowerCase() === "home" ? "/" : `/${link.toLowerCase()}`;

                return (
                  <span
                    key={i}
                    className="relative group hover:text-[#00BDA6] cursor-pointer"
                    onClick={() => navigate(path)}
                  >
                    {link}
                    {/* Underline animation */}
                    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#00BDA6] group-hover:w-full transition-all duration-300" />
                  </span>
                );
              })}
            </nav>

            {/* Dark mode switch button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------- */}
      {/* HERO SECTION — main landing hero with animated images */}
      {/* ------------------------------------------------- */}
      <section
        className={`pt-32 md:pt-44 pb-20 px-6 md:px-16 relative overflow-hidden transition-colors duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800"
            : "bg-gradient-to-br from-[#e0fdf4] via-[#f7fffe] to-[#c1f6e8]"
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* LEFT: Title + Text + Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#00BDA6] leading-tight mb-6">
              Learn. Connect. <br /> Grow with Peers.
            </h1>

            <p
              className={`text-lg mb-6 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Collaborate with passionate learners and build real-world tech skills through projects.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-gradient-to-r from-[#00BDA6] to-[#1BBC9B] hover:from-[#f97316] hover:to-[#fb923c] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-500 w-full sm:w-auto"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="bg-gradient-to-r from-[#f97316] to-[#fb923c] hover:from-[#00BDA6] hover:to-[#1BBC9B] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-500 w-full sm:w-auto"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Animated hero illustration cluster */}
          <div className="relative flex justify-center items-center">

            {/* Main hero illustration */}
            <motion.img
              src="https://i.postimg.cc/X7ypPmVZ/hero.jpg"
              alt="Main Hero"
              className="w-72 md:w-80 rounded-xl shadow-2xl z-10 mr-8 ml-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.9 }}
            />

            {/* Secondary floating illustrations */}
            <motion.img
              src="https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg"
              alt="Secondary Hero"
              className="absolute top-[-40px] right-[-30px] w-40 md:w-48 shadow-xl rounded-lg opacity-80"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.9 }}
            />

            <motion.img
              src="https://i.postimg.cc/50qrTPRm/s1.jpg"
              alt="Floating Hero"
              className="absolute bottom-[-30px] left-[-30px] w-36 md:w-44 rounded-lg shadow-md opacity-90"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.9 }}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- */}
      {/* FEATURES SECTION — clickable tiles directing by role */}
      {/* ------------------------------------------------- */}
      <section
        className={`py-20 px-6 md:px-16 text-center transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-10 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          What We Offer
        </h2>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((box, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06 }}
              onClick={() => handleNavigation(box.role)}
              className="cursor-pointer text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform transition
              bg-gradient-to-br from-[#00BDA6] to-[#1BBC9B]
              hover:from-[#f97316] hover:to-[#fb923c]"
            >
              <img
                src={box.icon}
                alt={box.title}
                className="h-14 mx-auto mb-4 bg-white p-2 rounded-full shadow-md"
              />
              <h3 className="text-xl font-semibold mb-2">{box.title}</h3>
              <p className="text-sm">{box.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- */}
      {/* PARTNERS SECTION — showing trusted company logos */}
      {/* ------------------------------------------------- */}
      <section
        className={`py-16 text-center transition-colors duration-300 ${
          darkMode ? "bg-gray-900" : "bg-[#f9f9f9]"
        }`}
      >
        <h3
          className={`text-2xl font-bold mb-8 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Trusted by Top Companies
        </h3>

        <div className="flex flex-wrap justify-center items-center gap-10">
          {[
            "https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
          ].map((logo, i) => (
            <motion.img
              key={i}
              src={logo}
              alt="partner"
              className="h-10 grayscale hover:grayscale-0 transition duration-500 hover:scale-105"
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- */}
      {/* FOOTER SECTION */}
      {/* ------------------------------------------------- */}
      <footer
        className={`w-full text-center py-4 text-sm transition-colors duration-300 border-t ${
          darkMode
            ? "bg-gray-950 text-gray-300 border-gray-700"
            : "bg-gray-700 text-gray-100 border-gray-300"
        }`}
      >
        <p>© 2025 Uptoskills. Built by learners.</p>
      </footer>

      {/* Global chatbot available on landing page */}
      <Chatbot />
    </div>
  );
}
