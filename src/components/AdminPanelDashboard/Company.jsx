import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Trash2, Eye, X, Mail, Phone, Globe, Briefcase, Calendar, Loader2, Search, AlertCircle } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/companies";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message, isDarkMode = false, confirmText = "Confirm", confirmColor = "red" }) => {
  if (!isOpen) return null;

  const getColorClasses = () => {
    switch(confirmColor) {
      case 'red':
        return 'bg-red-500 hover:bg-red-600';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'yellow':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-red-500 hover:bg-red-600';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative max-w-sm w-full rounded-2xl shadow-2xl p-8 ${
            isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}
        >
          {/* Icon */}
          <div className={`flex justify-center mb-6 p-4 rounded-full w-fit mx-auto ${
            isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'
          }`}>
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={onCancel}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>

            <motion.button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm text-white transition-all ${getColorClasses()}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Company({ isDarkMode }) {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    companyId: null
  });

  const showConfirmation = (message, companyId) => {
    setConfirmModal({ 
      isOpen: true, 
      message, 
      companyId
    });
  };

  const closeConfirmation = () => {
    setConfirmModal({
      isOpen: false,
      message: '',
      companyId: null
    });
  };

  const handleConfirmDelete = async () => {
    await performDelete(confirmModal.companyId);
    closeConfirmation();
  };

  // Apply/remove dark mode class on root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  // Fetch all companies
  const fetchAllCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  // ✅ FIXED: Client-side filtering
  const filteredCompanies = companies.filter((company) => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    const nameMatch = company.company_name?.toLowerCase().includes(term);
    const emailMatch = company.email?.toLowerCase().includes(term);
    const phoneMatch = company.phone?.toLowerCase().includes(term);
    
    return nameMatch || emailMatch || phoneMatch;
  });

  // Handler for showing confirmation before removing a company
  const handleRemoveCompany = (id) => {
    const companyName = companies.find(c => c.id === id)?.company_name || `ID ${id}`;
    showConfirmation(`Are you sure you want to remove ${companyName}?`, id);
  };

  // Perform the actual delete
  const performDelete = async (id) => {
    try {
      setIsDeleting(id);
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete company");
      setCompanies(current => current.filter(c => c.id !== id));
      // Notify admins about company removal (best-effort)
      try {
        const notifEndpoint = API_BASE_URL.replace('/api/companies', '') + '/api/notifications';
        await fetch(notifEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'admin',
            type: 'deletion',
            title: 'Company removed',
            message: `${companyName} was removed (id: ${id}).`,
            metadata: { entity: 'company', id }
          })
        });
      } catch (notifErr) {
        console.error('Failed to create notification for company removal', notifErr);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Fetch company details
  const fetchCompanyDetails = async (companyId) => {
    try {
      setLoadingDetails(true);
      setSelectedCompany(companyId);
      const res = await fetch(`${API_BASE_URL}/${companyId}/details`);
      const data = await res.json();
      if (data.success) {
        setCompanyDetails(data.data);
      } else {
        setSelectedCompany(null);
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
      setSelectedCompany(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setCompanyDetails(null);
  };

  return (
    <main
      className={`min-h-screen p-4 sm:p-8 font-inter transition-colors duration-500 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
    >
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirmation}
        message={confirmModal.message}
        isDarkMode={isDarkMode}
        confirmText="Remove"
        confirmColor="red"
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="text-4xl font-extrabold flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-500" />
          Manage Companies
        </div>

        {/* Search Bar */}
        <div
          className={`p-4 shadow-md rounded-lg border transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
            }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none ${isDarkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
                  : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
                }`}
              autoFocus
            />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={`rounded-lg shadow-md p-6 animate-pulse ${isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
              ></div>
            ))
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <motion.div
                key={company.id}
                layout
                className={`p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer shadow-md hover:shadow-lg transition-all ${isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold truncate">{company.company_name || company.name}</h3>
                      <button
                        onClick={() => fetchCompanyDetails(company.id)}
                        className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-blue-600 dark:text-blue-400"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  
                  <Mail className="w-4 h-4" />
      <span>{company.email || "No email available"}</span>
                </div>

                <motion.button
                  onClick={() => handleRemoveCompany(company.id)}
                  disabled={isDeleting === company.id}
                  className={`w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                    isDeleting === company.id
                      ? "bg-red-300 text-red-800 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting === company.id ? "Removing..." : "Remove"}
                </motion.button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm ? `No companies match "${searchTerm}"` : "No companies found."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Company Details Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                }`}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 z-10 p-6 border-b flex justify-between items-center ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}>
                <h2 className="text-2xl font-bold">Company Details</h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {loadingDetails ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : companyDetails ? (
                  <div className="space-y-6">
                    {/* Company Info Section */}
                    <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Company Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                          <p className="font-semibold">{companyDetails.company.company_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="font-semibold flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {companyDetails.company.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="font-semibold flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {companyDetails.company.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Registered Since</p>
                          <p className="font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(companyDetails.company.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Company Profile if exists */}
                      {companyDetails.profile && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {companyDetails.profile.website && (
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                                <a href={companyDetails.profile.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-500 hover:underline flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  Visit Website
                                </a>
                              </div>
                            )}
                            {companyDetails.profile.industry && (
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                                <p className="font-semibold flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" />
                                  {companyDetails.profile.industry}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Stats Section */}
                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-2xl font-bold text-blue-500">{companyDetails.stats.totalInterviews}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Interviews</p>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-2xl font-bold text-yellow-500">{companyDetails.stats.pendingInterviews}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-2xl font-bold text-green-500">{companyDetails.stats.completedInterviews}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-2xl font-bold text-purple-500">{companyDetails.stats.hiredCount}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Hired</p>
                      </div>
                    </div> */}

                    {/* Interviews Section */}
                    {/* {companyDetails.interviews.length > 0 && (
                      <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Interview History ({companyDetails.interviews.length})
                        </h3>
                        <div className="space-y-3">
                          {companyDetails.interviews.map((interview) => (
                            <div key={interview.id} className={`p-4 rounded-lg border ${isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"}`}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">Student ID: {interview.student_id}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Date: {new Date(interview.interview_date).toLocaleDateString()}
                                  </p>
                                  {interview.feedback && (
                                    <p className="text-sm mt-2">{interview.feedback}</p>
                                  )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${interview.status === 'completed'
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : interview.status === 'pending'
                                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                      : interview.status === 'hired'
                                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                                        : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                                  }`}>
                                  {interview.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}

                    {/* {companyDetails.interviews.length === 0 && (
                      <div className={`p-6 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-gray-500 dark:text-gray-400">No interview history available</p>
                      </div>
                    )} */}
                  </div>
                ) : (
                  <p className="text-center py-8">No details available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}