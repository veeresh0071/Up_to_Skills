import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Mail, Phone, Linkedin, Github, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactModal({ open, studentId, onClose }) {
  const [contactInfo, setContactInfo] = useState(null); // stores student data
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    // if modal closed or no student, don't fetch
    if (!open || !studentId) return;

    // fetching student contact details
    const fetchContactInfo = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/students/${studentId}`);
        setContactInfo(res.data.data); // store API response
      } catch (err) {
        console.error("❌ Unable to load contact info:", err);
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchContactInfo();
  }, [studentId, open]); // runs when modal opens or student changes

  return (
    <AnimatePresence>
      {open && (
        // background overlay
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          {/* modal box animation */}
          <motion.div
            key="modal"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 relative"
          >
            {/* close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            {loading ? (
              // loading animation
              <div className="flex justify-center items-center py-10 text-gray-500">
                <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-3"></div>
                Loading contact details...
              </div>
            ) : !contactInfo ? (
              // error message
              <p className="text-center text-red-500 py-6">
                Could not load contact info.
              </p>
            ) : (
              <>
                {/* student introduction */}
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="bg-blue-100 dark:bg-blue-800 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-200" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {contactInfo.full_name || "Unnamed Student"}
                  </h2>
                </div>

                {/* contact details section */}
                <div className="space-y-4 text-gray-700 dark:text-gray-200">

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span>{contactInfo.email || "Not Provided"}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-500" />
                    <span>{contactInfo.phone || "Not Provided"}</span>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    {contactInfo.linkedin_url ? (
                      <a
                        href={contactInfo.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    ) : (
                      <span>Not Provided</span>
                    )}
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-gray-800 dark:text-gray-100" />
                    {contactInfo.github_url ? (
                      <a
                        href={contactInfo.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        GitHub Profile
                      </a>
                    ) : (
                      <span>Not Provided</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
