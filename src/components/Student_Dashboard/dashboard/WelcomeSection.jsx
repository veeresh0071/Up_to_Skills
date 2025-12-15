// import React, { useState, useEffect } from "react";
// // Import useLocation from the incoming code to handle name refreshing
// import { useLocation } from "react-router-dom"; 

// function WelcomeSection() {
//   const [name, setName] = useState("Learner");
//   const location = useLocation(); // Keep this hook from the incoming code

//   // Merged useEffect logic: Use the cleaner approach from the incoming code
//   // and make it run on location.state change (after login/navigation).
//   useEffect(() => {
//     // Safely retrieve and parse the 'user' object from localStorage
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    
//     // Check if the 'name' property exists in the stored user data
//     if (storedUser.name) {
//       setName(storedUser.name);
//     } else {
//       // Fallback to the default if the data is not found or incomplete
//       setName("Learner");
//     }
//   }, [location.state]); // Dependency array: Re-run when navigation state changes

//   return (
//     <div className="welcome-section">
//       <div className="welcome-content">
//         <section className="p-6 rounded-2xl mb-8 transition-all duration-300 bg-gray-100 dark:bg-[#1e293b]">
//           <h2 className="text-3xl font-bold mb-2 transition-colors text-gray-800 dark:text-white">
//             Hey {name}! {/* Keep the Hey {name} format from HEAD/Incoming */}
//           </h2>

//           <p className="text-base leading-relaxed mb-2 transition-colors text-gray-700 dark:text-gray-300">
//             Your learning journey continues — and so does your path to real-world opportunities.
//             Earn badges, showcase projects, and get noticed by recruiters.
//           </p>

//           <p className="font-medium transition-colors text-blue-600 dark:text-blue-400">
//             Let's turn your effort into employment!
//           </p>
//         </section>
//       </div>

//       <div className="welcome-illustration">
//         <img
//           src="https://thumbs.dreamstime.com/b/illustration-young-boy-coding-his-laptop-surrounded-interface-elements-perfect-education-remote-work-technology-376158298.jpg"
//           alt="Learning illustration"
//         />
//       </div>
//     </div>
//   );
// }

// export default WelcomeSection;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

function WelcomeSection() {
  const [name, setName] = useState("Learner");
  const location = useLocation();
  const { darkMode } = useTheme();

  // Fetch user name from localStorage on mount or when route state changes
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.name) {
      setName(storedUser.name);
    } else {
      setName("Learner");
    }
  }, [location.state]);

  return (
    <div
      className={`welcome-section p-6 rounded-2xl mb-8 transition-all duration-300 flex items-center justify-between gap-6 ${
        darkMode ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      {/* ---- Left side: Text content ---- */}
      <div className="welcome-content flex-1">
        <h2
          className={`text-3xl font-bold mb-2 transition-colors ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Hey {name}!
        </h2>

        <p
          className={`text-base leading-relaxed mb-2 transition-colors ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Your learning journey continues — and so does your path to real-world opportunities.
          Earn badges, showcase projects, and get noticed by recruiters.
        </p>

        <p
          className={`font-medium transition-colors ${
            darkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          Let's turn your effort into employment!
        </p>
      </div>

      {/* ---- Right side: Illustration ---- */}
      <div className="welcome-illustration flex-shrink-0">
        <img
          src="https://thumbs.dreamstime.com/b/illustration-young-boy-coding-his-laptop-surrounded-interface-elements-perfect-education-remote-work-technology-376158298.jpg"
          alt="Learning illustration"
          className="w-48 h-auto rounded-lg shadow-md object-cover"
        />
      </div>
    </div>
  );
}

export default WelcomeSection;
