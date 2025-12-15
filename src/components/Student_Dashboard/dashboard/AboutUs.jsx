// // src/pages/AboutUs.jsx
// import React, { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import Footer from "./Footer";
// import { FaLinkedin, FaPhone, FaEnvelope, FaUsers } from "react-icons/fa";

// export default function AboutUs() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     // detect dark mode from body or system preference
//     const checkDark = () =>
//       setIsDarkMode(document.documentElement.classList.contains("dark"));
//     checkDark();
//     const observer = new MutationObserver(checkDark);
//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) setIsSidebarOpen(false);
//       else setIsSidebarOpen(true);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div
//       className={`flex min-h-screen transition-colors duration-300 ${
//         isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
//       }`}
//     >
//       {/* Sidebar */}
//       <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

//       {/* Main content */}
//       <div className="flex-1 flex flex-col transition-all duration-300">
//         {/* Header */}
//         <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

//         {/* Page Content */}
//         <main
//           className={`flex-grow p-6 lg:p-10 transition-all duration-300 ${
//             isSidebarOpen && window.innerWidth >= 1024 ? "lg:ml-64" : ""
//           }`}
//         >
//           <div className="max-w-6xl mx-auto">
//             {/* About Section */}
//             <div
//               className={`rounded-2xl p-8 shadow-md border transition-colors duration-300 ${
//                 isDarkMode
//                   ? "bg-gray-800/60 border-gray-700"
//                   : "bg-white border-gray-200"
//               }`}
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <FaUsers className="text-orange-500 text-3xl" />
//                 <h1 className="text-3xl font-bold">About UptoSkill</h1>
//               </div>

//               <p
//                 className={`mb-6 ${
//                   isDarkMode ? "text-gray-300" : "text-gray-700"
//                 }`}
//               >
//                 Empowering students to build skills, collaborate, and grow
//                 through real-world projects and personalized mentorship.
//               </p>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//                 {/* Mission Section */}
//                 <div>
//                   <h2 className="text-orange-500 font-semibold text-xl mb-3">
//                     Our Mission
//                   </h2>
//                   <p
//                     className={`mb-4 ${
//                       isDarkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     UptoSkill connects ambitious students with professional
//                     mentors, enabling hands-on project experience, valuable
//                     insights, and growth-oriented learning opportunities.
//                   </p>

//                   <h3 className="text-lg font-semibold mb-2">
//                     What students can do
//                   </h3>
//                   <ul
//                     className={`list-disc list-inside space-y-2 ${
//                       isDarkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     <li>Collaborate with experienced mentors on real projects.</li>
//                     <li>Gain feedback to improve technical and soft skills.</li>
//                     <li>
//                       Build an impressive portfolio with industry-level
//                       guidance.
//                     </li>
//                   </ul>
//                   <hr
//                     className={`my-4 ${
//                       isDarkMode ? "border-gray-600" : "border-gray-300"
//                     }`}
//                   />
//                   <p
//                     className={`text-sm ${
//                       isDarkMode ? "text-gray-400" : "text-gray-600"
//                     }`}
//                   >
//                     We believe in practical learning and teamwork. UptoSkill
//                     helps students develop confidence and employable skills
//                     through mentorship, structured learning, and collaboration.
//                   </p>
//                 </div>

//                 {/* Values Section */}
//                 <div>
//                   <h2 className="text-orange-500 font-semibold text-xl mb-3">
//                     Values & Approach
//                   </h2>
//                   <p
//                     className={`mb-4 ${
//                       isDarkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     We value experiential learning that drives growth. UptoSkill
//                     is designed to make student learning interactive,
//                     collaborative, and career-focused.
//                   </p>

//                   <div
//                     className={`p-4 rounded-xl transition-colors ${
//                       isDarkMode ? "bg-gray-700/60" : "bg-gray-100"
//                     }`}
//                   >
//                     <h3 className="font-semibold text-orange-400 mb-1">
//                       Why students choose UptoSkill
//                     </h3>
//                     <p
//                       className={`text-sm ${
//                         isDarkMode ? "text-gray-300" : "text-gray-700"
//                       }`}
//                     >
//                       UptoSkill empowers students to explore new domains, get
//                       guidance from experts, and build a strong foundation for
//                       their future careers.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Contact Section */}
//             <section className="mt-12 text-center">
//               <h3 className="text-orange-500 font-semibold tracking-wide">
//                 OUR CONTACTS
//               </h3>
//               <h2 className="text-3xl font-bold mt-2 mb-4">
//                 We’re here to Help You
//               </h2>
//               <p
//                 className={`max-w-3xl mx-auto mb-10 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}
//               >
//                 Got a project in mind? We’d love to hear about it. Take a few
//                 minutes to fill out our project form so we can get to know you
//                 and understand your project.
//               </p>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
//                 {/* LinkedIn */}
//                 <a
//                   href="https://www.linkedin.com/company/uptoskills/posts/?feedView=all"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className={`rounded-2xl shadow-lg p-6 text-center border transition-all hover:shadow-xl hover:border-orange-500 ${
//                     isDarkMode
//                       ? "bg-gray-800 border-gray-700"
//                       : "bg-white border-gray-200"
//                   }`}
//                 >
//                   <FaLinkedin
//                     className="text-orange-500 mx-auto mb-4"
//                     size={40}
//                   />
//                   <h3 className="text-lg font-semibold mb-2">
//                     Get to Know Us:
//                   </h3>
//                   <p
//                     className={`${
//                       isDarkMode ? "text-gray-400" : "text-gray-600"
//                     }`}
//                   >
//                     www.LinkedIn.com
//                   </p>
//                 </a>

//                 {/* Phone */}
//                 <a
//                   href="tel:+919319772294"
//                   className={`rounded-2xl shadow-lg p-6 text-center border transition-all hover:shadow-xl hover:border-orange-500 ${
//                     isDarkMode
//                       ? "bg-gray-800 border-gray-700"
//                       : "bg-white border-gray-200"
//                   }`}
//                 >
//                   <FaPhone className="text-orange-500 mx-auto mb-4" size={40} />
//                   <h3 className="text-lg font-semibold mb-2">Phone Us 24/7:</h3>
//                   <p
//                     className={`${
//                       isDarkMode ? "text-gray-400" : "text-gray-600"
//                     }`}
//                   >
//                     +91 (931) 977 2294
//                   </p>
//                 </a>

//                 {/* Email */}
//                 <a
//                   href="mailto:info@uptoskills.com"
//                   className={`rounded-2xl shadow-lg p-6 text-center border transition-all hover:shadow-xl hover:border-orange-500 ${
//                     isDarkMode
//                       ? "bg-gray-800 border-gray-700"
//                       : "bg-white border-gray-200"
//                   }`}
//                 >
//                   <FaEnvelope
//                     className="text-orange-500 mx-auto mb-4"
//                     size={40}
//                   />
//                   <h3 className="text-lg font-semibold mb-2">Mail Us 24/7:</h3>
//                   <p
//                     className={`${
//                       isDarkMode ? "text-gray-400" : "text-gray-600"
//                     }`}
//                   >
//                     info@uptoskills.com
//                   </p>
//                 </a>
//               </div>
//             </section>
//           </div>
//         </main>

//         {/* Footer */}
//         <Footer />
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { FaLinkedin, FaPhone, FaEnvelope, FaUsers } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";

export default function AboutUs() {
  // Sidebar open/close state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dark mode from Theme context
  const { darkMode: isDarkMode } = useTheme();

  // Adjust sidebar visibility based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header component with menu toggle */}
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main
          className={`flex-grow p-6 lg:p-10 transition-all duration-300 ${
            isSidebarOpen && window.innerWidth >= 1024 ? "lg:ml-64" : ""
          }`}
        >
          <div className="max-w-6xl mx-auto">
            {/* About Section */}
            <div
              className={`mt-10 rounded-2xl p-8 shadow-md border transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-800/60 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Header with icon */}
              <div className="flex items-center gap-3 mb-6">
                <FaUsers className="text-orange-500 text-3xl" />
                <h1 className="text-3xl font-bold">About UptoSkill</h1>
              </div>

              {/* Intro paragraph */}
              <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Empowering students to build skills, collaborate, and grow
                through real-world projects and personalized mentorship.
              </p>

              {/* Mission and Values Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Mission Section */}
                <div>
                  <h2 className="text-orange-500 font-semibold text-xl mb-3">
                    Our Mission
                  </h2>
                  <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    UptoSkill connects ambitious students with professional
                    mentors, enabling hands-on project experience, valuable
                    insights, and growth-oriented learning opportunities.
                  </p>

                  <h3 className="text-lg font-semibold mb-2">
                    What students can do
                  </h3>
                  <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <li>Collaborate with experienced mentors on real projects.</li>
                    <li>Gain feedback to improve technical and soft skills.</li>
                    <li>Build an impressive portfolio with industry-level guidance.</li>
                  </ul>

                  <hr className={`my-4 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`} />
                </div>

                {/* Values Section */}
                <div>
                  <h2 className="text-orange-500 font-semibold text-xl mb-3">
                    Values & Approach
                  </h2>
                  <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    We value experiential learning that drives growth. UptoSkill
                    is designed to make student learning interactive,
                    collaborative, and career-focused.
                  </p>

                  <div className={`p-4 rounded-xl transition-colors ${isDarkMode ? "bg-gray-700/60" : "bg-gray-100"}`}>
                    <h3 className="font-semibold text-orange-400 mb-1">
                      Why students choose UptoSkill
                    </h3>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      UptoSkill empowers students to explore new domains, get
                      guidance from experts, and build a strong foundation for
                      their future careers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <section className="mt-12 text-center">
              <h3 className="text-orange-500 font-semibold tracking-wide">
                OUR CONTACTS
              </h3>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                We’re here to Help You
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Phone Contact */}
                <a
                  href="tel:+919319772294"
                  className={`rounded-2xl shadow-lg p-6 text-center border transition-all hover:shadow-xl hover:border-orange-500 ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <FaPhone className="text-orange-500 mx-auto mb-4" size={40} />
                  <h3 className="text-lg font-semibold mb-2">Phone Us 24/7:</h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    +91 (931) 977 2294
                  </p>
                </a>

                {/* Email Contact */}
                <a
                  href="mailto:info@uptoskills.com"
                  className={`rounded-2xl shadow-lg p-6 text-center border transition-all hover:shadow-xl hover:border-orange-500 ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <FaEnvelope className="text-orange-500 mx-auto mb-4" size={40} />
                  <h3 className="text-lg font-semibold mb-2">Mail Us 24/7:</h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    info@uptoskills.com
                  </p>
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
