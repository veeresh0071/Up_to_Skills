import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function Testimonials({ isDarkMode = false }) {
  const [testimonials, setTestimonials] = useState([
    { id: 1, text: "Test Review", author: "Pratishtha", role: "student", date: "03/11/2025, 14:21:36" },
    { id: 2, text: "TEST", author: "TEST", role: "TEST", date: "03/11/2025, 04:07:22" },
    { id: 3, text: "Test", author: "Pratishtha", role: "TEST", date: "31/10/2025, 13:38:29" },
    { id: 4, text: "Test", author: "Test", role: "", date: "27/10/2025, 12:50:50" },
    { id: 5, text: "Glad to work with Uptoskills", author: "Boobesh K", role: "", date: "15/10/2025, 14:21:54" },
    { id: 6, text: "test", author: "Pratishtha", role: "student", date: "15/10/2025, 14:21:15" },
    { id: 7, text: "Glad to work", author: "Mohan", role: "", date: "15/10/2025, 13:59:06" },
    { id: 8, text: "Good", author: "Test", role: "student", date: "15/10/2025, 13:52:10" },
    { id: 9, text: "Glad to work with upToSkills", author: "Kanchan", role: "student", date: "15/10/2025, 13:37:47" },
    { id: 10, text: "Supporting teachers", author: "Kartik", role: "web dev intern", date: "15/10/2025, 13:24:00" },
    { id: 11, text: "Great place to learn", author: "Rachit", role: "", date: "15/10/2025, 13:22:26" },
    { id: 12, text: "Hello", author: "Rachit Taneja", role: "web dev intern", date: "15/10/2025, 12:59:20" },
  ]);

  // ⭐ Popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Delete function
  const handleDelete = (id) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-5xl rounded-2xl shadow-2xl p-8 backdrop-blur-sm ${
          isDarkMode ? "bg-gray-800/95" : "bg-white/95"
        }`}
      >
        <h2 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Testimonials
        </h2>

        <p className={`text-center mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          What our community says about us
        </p>

        <div className="space-y-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`group relative p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                isDarkMode
                  ? "bg-gray-900/50 border-gray-700 hover:border-blue-500/50 hover:shadow-blue-500/10"
                  : "bg-gray-50/50 border-gray-200 hover:border-purple-300 hover:shadow-purple-200/50"
              }`}
            >
              {/* ⭐ Delete Button */}
              <button
                onClick={() => {
                  setDeleteId(t.id);
                  setShowDeletePopup(true);
                }}
                className={`absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  isDarkMode
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    : "bg-red-50 hover:bg-red-100 text-red-600"
                }`}
              >
                <Trash2 size={18} />
              </button>

              {/* Quote Icon */}
              <div
                className={`text-5xl mb-2 leading-none ${
                  isDarkMode ? "text-gray-700" : "text-gray-200"
                }`}
              >
                "
              </div>

              <p
                className={`text-lg mb-4 leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t.text}
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                      : "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
                  }`}
                >
                  {t.author.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg truncate">{t.author}</h4>

                  {t.role && (
                    <p
                      className={`text-sm truncate ${
                        isDarkMode ? "text-blue-400" : "text-purple-600"
                      }`}
                    >
                      {t.role}
                    </p>
                  )}
                </div>

                <p
                  className={`text-xs whitespace-nowrap ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {t.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ DELETE POPUP */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-[420px] min-h-[180px] text-center">
            <h2 className="text-xl font-bold mb-4">Delete Testimonial?</h2>

            <p className="text-base mb-8">Are you sure you want to delete this testimonial?</p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  handleDelete(deleteId);
                  setShowDeletePopup(false);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-sm font-medium"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setShowDeletePopup(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-600 py-3 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
