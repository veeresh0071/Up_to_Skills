// src/pages/NotFound.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX, Home, ArrowLeft, Mail } from 'lucide-react';

/*
 =============================================================================
  NOT FOUND PAGE (404)
  ---------------------------------------------------------------------------
  This page is displayed when the user navigates to an invalid or non-existing
  route. It provides a helpful UI with navigation options to go back or home,
  along with a support contact for assistance.
 =============================================================================
*/

const NotFound = () => {
  const navigate = useNavigate(); // Used for navigation actions (go back, go home)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* ========================= MAIN CARD CONTAINER ========================= */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border-4 border-blue-100">

          {/* -------------------- Icon Section (Search + Glow) -------------------- */}
          <div className="mb-8 flex justify-center">
            <div className="relative">

              {/* Soft glowing background animation */}
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>

              {/* Foreground Icon container */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-8 shadow-2xl">
                <SearchX className="w-20 h-20 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* ----------------------------- Error Code ----------------------------- */}
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>

          {/* --------------------------- Main Heading ----------------------------- */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>

          {/* ---------------------- Explanation Messages ---------------------- */}
          <p className="text-lg text-gray-600 mb-4 leading-relaxed max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist.
          </p>

          <p className="text-base text-gray-500 mb-8">
            It might have been moved, deleted, or the URL might be incorrect.
          </p>

          {/* ------------------------- Text Divider Line ------------------------- */}
          <div className="flex items-center gap-4 my-8 max-w-md mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-sm text-gray-400 font-medium">What would you like to do?</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* ============================= Action Buttons ============================= */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">

            {/* Go Back → Takes user to previous route */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>

            {/* Go Home → Takes user to homepage */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00BDA6] to-[#00a693] text-white rounded-xl font-semibold hover:from-[#009688] hover:to-[#00877a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>

          {/* ============================== Support Box ============================== */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <p className="text-sm text-gray-600 mb-2">
              <strong className="text-gray-800">Need assistance?</strong>
            </p>

            <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Contact us at{" "}
              <a
                href="mailto:support@uptoskills.com"
                className="text-[#00BDA6] hover:text-[#FF6D34] font-semibold underline decoration-2 underline-offset-2 transition-colors"
              >
                support@uptoskills.com
              </a>
            </p>
          </div>

        </div>

        {/* ========================== Footer Navigation Tip ========================== */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Looking for something specific? Try navigating from the{" "}
          <button
            onClick={() => navigate('/')}
            className="text-[#00BDA6] hover:text-[#FF6D34] font-semibold underline transition-colors"
          >
            home page
          </button>
        </p>

      </div>
    </div>
  );
};

export default NotFound;
