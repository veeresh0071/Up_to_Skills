import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, User, Plus, Sun, Moon } from "lucide-react";

function MentorReview() {
  const [mentorReviews, setMentorReviews] = useState([]);
  const [newReviewMentor, setNewReviewMentor] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🌓 Load & Apply Theme on Mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const root = document.documentElement;
    if (savedTheme === "dark") {
      root.classList.add("dark");
      setIsDarkMode(true);
    } else {
      root.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  // 🌓 Handle Theme Toggle
  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/mentorreviews")
      .then((res) => res.json())
      .then((data) => data.success && setMentorReviews(data.data))
      .catch(console.error);
  }, []);

  const addMentorReview = () => {
    if (!newReviewMentor || !newReviewText || newReviewRating === "") return;

    const review = {
      mentor: newReviewMentor,
      feedback: newReviewText,
      rating: parseFloat(newReviewRating),
    };

    fetch("http://localhost:5000/api/mentorreviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMentorReviews([data.data, ...mentorReviews]);
          setNewReviewMentor("");
          setNewReviewText("");
          setNewReviewRating("");
        } else alert(data.message);
      })
      .catch(console.error);
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rounded
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-400"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-foreground">
          {rating}
        </span>
      </div>
    );
  };

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6 transition-all duration-300 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Mentor Reviews
        </motion.h2>

        {/* 🌙 Theme Toggle Button */}
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </motion.button>
      </div>

      {/* Add New Review Form */}
      <motion.div
        className="stat-card p-6 mb-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Add New Review
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Mentor Name
            </label>
            <input
              type="text"
              placeholder="Mentor Name"
              value={newReviewMentor}
              onChange={(e) => setNewReviewMentor(e.target.value)}
              className="input-field w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Review Text
            </label>
            <input
              type="text"
              placeholder="Review Text"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              className="input-field w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Rating (0-5)
            </label>
            <input
              type="number"
              placeholder="Rating (0-5)"
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(e.target.value)}
              min="0"
              max="5"
              step="0.1"
              className="input-field w-full rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border dark:border-gray-600"
            />
          </div>
        </div>
        <motion.button
          onClick={addMentorReview}
          className="btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" /> Add Review
        </motion.button>
      </motion.div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentorReviews.map((review, index) => (
          <motion.div
            key={review.id}
            className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg cursor-pointer transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-blue-500">
                <User className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {review.mentor}
              </h4>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" />
              <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                "{review.feedback}"
              </p>
            </div>

            <div className="flex items-center justify-between">
              {renderStars(review.rating)}
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

export default MentorReview;
