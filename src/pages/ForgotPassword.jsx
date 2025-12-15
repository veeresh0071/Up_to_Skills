import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

// ===========================================
// ForgotPassword Component
// Handles password reset with validation,
// toast notifications, password strength checking,
// and redirect after success.
// ===========================================
const ForgotPassword = () => {

  // ===============================
  // STATE MANAGEMENT
  // ===============================

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Input fields state
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Navigation hook to redirect after success
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  // ===============================
  // PASSWORD VALIDATION RULES
  // Strong password = must pass all checks
  // ===============================

  const hasUpperCase = /[A-Z]/.test(password);              // At least 1 uppercase letter
  const hasLowerCase = /[a-z]/.test(password);              // At least 1 lowercase letter
  const hasNumber = /\d/.test(password);                    // At least 1 number
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // At least 1 special character
  const isMinLength = password.length >= 8;                 // Minimum 8 characters

  // Combined strong password check
  const isStrongPassword =
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar &&
    isMinLength;

  // Password match logic
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const passwordsMismatch = password !== confirmPassword && confirmPassword.length > 0;

  // ===============================
  // SUBMIT HANDLER
  // Called when user resets password
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Passwords must match
    if (!passwordsMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validation: Password must be strong
    if (!isStrongPassword) {
      toast.error("Password must be 8+ chars with uppercase, lowercase, number & special char!");
      return;
    }

    try {
      // Making POST request to backend
      const response = await axios.post("http://localhost:5000/api/forgot-password", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Password reset successfully!");

        // Redirect user after success
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div
      className={`relative flex justify-center items-center min-h-screen px-4 py-10 transition-colors duration-300 ${
        darkMode ? "bg-[#020817] text-gray-100" : "bg-[#F9FAFB] text-gray-900"
      }`}
    >
      <button
        onClick={toggleDarkMode}
        className={`absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-colors ${
          darkMode
            ? "bg-slate-800 text-yellow-300 hover:bg-slate-700"
            : "bg-white text-slate-600 hover:bg-slate-100"
        }`}
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div
        className={`flex rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full border transition-colors duration-300 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}
      >
        {/* Left Image */}
        <div
          className={`w-1/2 hidden md:flex items-center justify-center p-10 transition-colors duration-300 ${
            darkMode ? "bg-slate-950" : "bg-[#F5F9FF]"
          }`}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
            alt="Forgot Password"
            className="w-3/4 drop-shadow-lg"
          />
        </div>

        {/* ===================================== */}
        {/* RIGHT SIDE FORM SECTION */}
        {/* ===================================== */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

          {/* Title */}
          <h2 className="text-3xl font-bold text-[#09C3A1]">
            Forgot <span className="text-[#FF6600]">Password</span>
          </h2>

          <p className={`mt-1 mb-6 text-base ${darkMode ? "text-slate-300" : "text-gray-500"}`}>
            Enter your registered email or username and new password
          </p>

          {/* =========================== */}
          {/* RESET PASSWORD FORM */}
          {/* =========================== */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Field */}
            <input
              type="email"
              placeholder="Enter registered email-id or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#09C3A1] transition-colors ${
                darkMode
                  ? "bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400"
                  : "border border-gray-300 bg-white text-gray-900"
              }`}
            />

            {/* =========================== */}
            {/* NEW PASSWORD FIELD */}
            {/* =========================== */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password (8+ chars, uppercase, lowercase, number, special)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full rounded-md px-4 py-3 focus:outline-none
                  ${isStrongPassword ? "border border-green-500" : ""}
                  ${!isStrongPassword && password ? "border border-red-500" : ""}
                  ${!password ? (darkMode ? "border border-slate-700" : "border border-gray-300") : ""}
                  ${darkMode ? "bg-slate-800 text-white placeholder:text-slate-400" : "bg-white text-gray-900"}`}
              />

              {/* Toggle password visibility */}
              <div
                className={`absolute inset-y-0 right-3 flex items-center cursor-pointer ${
                  darkMode ? "text-slate-400" : "text-gray-500"
                }`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* =========================== */}
            {/* CONFIRM PASSWORD FIELD */}
            {/* =========================== */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full rounded-md px-4 py-3 focus:outline-none
                  ${passwordsMatch ? "border border-green-500" : ""}
                  ${passwordsMismatch ? "border border-red-500" : ""}
                  ${!passwordsMatch && !passwordsMismatch ? (darkMode ? "border border-slate-700" : "border border-gray-300") : ""}
                  ${darkMode ? "bg-slate-800 text-white placeholder:text-slate-400" : "bg-white text-gray-900"}`}
              />

              {/* Toggle confirm-password visibility */}
              <div
                className={`absolute inset-y-0 right-3 flex items-center cursor-pointer ${
                  darkMode ? "text-slate-400" : "text-gray-500"
                }`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* =========================== */}
            {/* PASSWORD STRENGTH MESSAGE */}
            {/* =========================== */}
            {password && (
              <div className="space-y-1">
                <p className={`text-sm ${isStrongPassword ? "text-green-500" : "text-red-500"}`}>
                  {isStrongPassword ? "✔ Strong password" : "✖ Password too weak"}
                </p>
                <div className={`flex gap-1 text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                  <span>8+ chars</span>
                  <span>ABC</span>
                  <span>abc</span>
                  <span>123</span>
                  <span>@#$</span>
                </div>
              </div>
            )}

            {/* Match/Mismatch messages */}
            {passwordsMatch && (
              <p className="text-green-500 text-sm">✔ Passwords match</p>
            )}
            {passwordsMismatch && (
              <p className="text-red-500 text-sm">✖ Passwords do not match</p>
            )}

            {/* =========================== */}
            {/* RESET PASSWORD BUTTON */}
            {/* =========================== */}
            <button
              type="submit"
              disabled={!passwordsMatch || !isStrongPassword}
              className={`w-full flex items-center justify-center gap-2 rounded-md py-3 font-semibold transition duration-300 ${
                passwordsMatch && isStrongPassword
                  ? "bg-[#09C3A1] hover:bg-[#07a589] text-white"
                  : darkMode
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              🔒 Reset Password
            </button>
          </form>

          <p className={`text-center mt-5 ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
            Remembered your password?{" "}
            <Link to="/login" className="text-[#09C3A1] font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? "dark" : "light"} />
    </div>
  );
};

export default ForgotPassword;
