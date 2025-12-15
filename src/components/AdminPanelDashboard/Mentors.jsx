// Mentors.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Eye, X, Users, Search, Loader2 } from "lucide-react";

/* ----------------------- DELETE CONFIRM POPUP ----------------------- */
const DeleteConfirmModal = ({ onClose, onConfirm, isDarkMode }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div
      className={`p-6 rounded-xl shadow-xl w-[90%] max-w-md border 
      ${isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Confirm Delete</h2>
      <p className="text-center mb-6">Are you sure you want to delete this mentor?</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Yes, Delete
        </button>
        <button
          onClick={onClose}
          className={`px-5 py-2 rounded-lg border 
          ${isDarkMode ? "border-gray-600 text-white hover:bg-gray-700" : "border-gray-400 hover:bg-gray-100"}`}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

/* ---------------------------- MENTOR CARD ---------------------------- */
const MentorCard = ({ mentor, onAskDelete, isDarkMode }) => {
  const [showDetails, setShowDetails] = useState(false);

  const expertiseText = Array.isArray(mentor.expertise_domains)
    ? mentor.expertise_domains.join(", ")
    : mentor.expertise_domains || "No expertise added";

  return (
    <>
      <div
        className={`rounded-xl shadow-lg hover:shadow-xl p-6 transition-all border
        ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600">
            <User className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold break-words">{mentor.full_name}</h3>

                <p className={`text-sm mt-1 break-words ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                  {expertiseText}
                </p>

                <p className={`text-sm mt-1 break-words ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                  {mentor.email}
                </p>
              </div>

              <button
                onClick={() => setShowDetails(true)}
                className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition text-blue-600 dark:text-blue-400"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* DELETE BUTTON */}
        <div className={`flex justify-end mt-4 pt-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
          <button
            onClick={() => onAskDelete(mentor.id)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowDetails(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border
            ${isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}
          >
            <div
              className={`sticky top-0 p-6 border-b flex justify-between items-center
              ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <h2 className="text-2xl font-bold">Mentor Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p><strong>Name:</strong> {mentor.full_name}</p>
              <p><strong>Email:</strong> {mentor.email}</p>
              <p><strong>Phone:</strong> {mentor.phone || "N/A"}</p>
              <p><strong>Expertise:</strong> {expertiseText}</p>

              {mentor.linkedin_url && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={mentor.linkedin_url} className="text-blue-400 underline break-all" target="_blank" rel="noreferrer">
                    View Profile
                  </a>
                </p>
              )}

              {mentor.github_url && (
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a href={mentor.github_url} className="text-blue-400 underline break-all" target="_blank" rel="noreferrer">
                    View Profile
                  </a>
                </p>
              )}

              <p><strong>About:</strong> {mentor.about_me || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ------------------------- MAIN COMPONENT ------------------------- */
export default function Mentors({ isDarkMode }) {
  const [mentors, setMentors] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/api/mentors`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const payload = res.data;
      const data = Array.isArray(payload)
        ? payload
        : payload?.data || payload?.mentors || [];

      setMentors(data);
    } catch (err) {
      console.error("Error fetching mentors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  /* FILTERING FIXED */
  const filtered = mentors.filter((m) => {
    const s = searchTerm.toLowerCase();

    return (
      (m.full_name || "").toLowerCase().includes(s) ||
      (m.email || "").toLowerCase().includes(s) ||
      (Array.isArray(m.expertise_domains)
        ? m.expertise_domains.join(", ").toLowerCase()
        : (m.expertise_domains || "").toLowerCase()
      ).includes(s)
    );
  });

  return (
    <section
      className={`p-6 min-h-screen transition-all duration-300 
      ${isDarkMode ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="text-4xl font-extrabold flex items-center gap-3">
        <Users className="w-8 h-8 text-indigo-500" />
        Manage Mentors
      </div>

      <br />

      {/* SEARCH BOX */}
      <div
        className={`p-4 shadow-lg rounded-xl mb-8 border transition-all 
        ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-2 rounded-lg border outline-none 
            focus:ring-2 focus:ring-blue-400
            ${isDarkMode
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"}`}
          />

          {searching && (
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-lg">
          No mentors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <MentorCard
              key={m.id}
              mentor={m}
              onAskDelete={setDeleteId}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}

      {/* DELETE POPUP */}
      {deleteId && (
        <DeleteConfirmModal
          isDarkMode={isDarkMode}
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            const token = localStorage.getItem("token");
            try {
              await axios.delete(`${API_BASE}/api/mentors/${deleteId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              });

              setMentors((prev) => prev.filter((m) => m.id !== deleteId));
            } catch (err) {
              console.error("Delete failed", err);
            }
            setDeleteId(null);
          }}
        />
      )}
    </section>
  );
}
