import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const API = "http://localhost:5000";

const Testimonials = () => {
  const { darkMode } = useTheme();
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API}/api/testimonials`);
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load testimonials");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim() || !form.message.trim()) {
      setError("Name and message are required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/testimonials`, form);
      setTestimonials((prev) => [res.data, ...prev]);
      setForm({ name: "", role: "", message: "" });
      setShowForm(false);
      setSuccess("✅ Your review has been submitted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit testimonial");
    } finally {
      setLoading(false);
    }
  };

  const featuredTestimonials = [];

  return (
    <div className={`relative rounded-2xl shadow-md p-6 flex flex-col justify-between h-[450px] ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <h3 className={`font-semibold text-lg mb-3 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
        Testimonials
      </h3>

      <div className="overflow-y-auto pr-2 h-[350px] space-y-4 custom-scroll">
        {[...featuredTestimonials, ...testimonials].length === 0 ? (
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No testimonials yet — be the first to add one!
          </p>
        ) : (
          [...testimonials].map((t, i) => (
            <div
              key={i}
              className={`border-l-4 border-green-500 pl-4 text-left rounded-md transition-all duration-200 shadow-sm ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"}`}
            >
              <p className={`italic mb-2 leading-relaxed text-sm ${darkMode ? "text-gray-300" : "text-[#334155]"}`}>
                "{t.message.trim()}"
              </p>
              <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                – {t.name}
                {t.role ? `, ${t.role}` : ""}
              </p>
              {t.created_at && (
                <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {new Date(t.created_at).toLocaleString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="text-center mt-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#FF6A28] text-white px-6 py-3 rounded-full font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1)] border-none cursor-pointer transition-all duration-300 ease hover:bg-[#00C7B1]"
        >
          Give Review
        </button>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {success}
        </motion.div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <motion.div
            className={`rounded-xl shadow-lg p-8 w-[90%] max-w-md relative ${darkMode ? "bg-gray-800" : "bg-white"}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowForm(false)}
              className={`absolute top-3 right-3 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
            >
              ✖
            </button>
            <h4 className={`font-semibold mb-4 text-xl text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
              Add a Testimonial
            </h4>
            {error && <div className="text-red-500 mb-3">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>
              <div className="mb-3">
                <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Role (optional)</label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>
              <div className="mb-3">
                <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="bg-[#FF6A28] text-white px-4 py-2 rounded w-full hover:bg-[#00C7B1] transition-colors"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
