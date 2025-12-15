// src/components/.../EditProfile.jsx

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function EditProfile() {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    industry: "",
    contact: "",
    logo: null,
    logoPreview: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Popup State
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const token = localStorage.getItem("token");

  /* --------------------------------------------------
    FETCH PROFILE
  -------------------------------------------------- */
  useEffect(() => {
    // fetch company profile data on load
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/company-profiles/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          const data = res.data.data;
          setFormData({
            companyName: data.name || data.company_name || "",
            website: data.website || "",
            industry: data.industry || "",
            contact: data.contact || "",
            logo: null,
            logoPreview: data.logo_url
              ? `http://localhost:5000${data.logo_url}`
              : null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
        setPopupMessage("Failed to load profile");
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  /* --------------------------------------------------
    FORM HANDLERS
  -------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const applyLogoFile = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleLogoInputChange = (e) => {
    applyLogoFile(e.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    applyLogoFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName || !formData.industry) {
      setPopupMessage("Please fill in all required fields");
      setShowPopup(true);
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", formData.companyName);
      fd.append("website", formData.website);
      fd.append("industry", formData.industry);
      fd.append("contact", formData.contact);
      if (formData.logo) fd.append("logo", formData.logo);

      const res = await axios.put(
        "http://localhost:5000/api/company-profiles",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setPopupMessage("Profile saved successfully!");
      } else {
        setPopupMessage(res.data.message || "Failed to save profile");
      }
      setShowPopup(true);
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      setPopupMessage(err.response?.data?.message || "Failed to save profile");
      setShowPopup(true);
    } finally {
      setSaving(false);
    }
  };

  /* --------------------------------------------------
    LOADING SCREEN
  -------------------------------------------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------
    COMPONENT RENDER
  -------------------------------------------------- */
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex justify-center items-start p-6">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 dark:text-white shadow-lg rounded-xl p-8 mt-10">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
              {formData.companyName ? "Edit Company Profile" : "Add Company Profile"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              encType="multipart/form-data"
            >
              {/* Company Name */}
              <div>
                <label className="block font-semibold mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block font-semibold mb-2">Company Logo</label>
                <div
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-slate-800/70"
                      : "border-gray-300 dark:border-gray-700 hover:border-blue-500"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.logoPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={formData.logoPreview}
                        alt="Logo preview"
                        className="h-28 w-auto rounded-lg border bg-white object-contain"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Click or drag a new file to replace the logo
                      </p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-9 w-9 text-blue-500" />
                      <p className="mt-3 text-sm text-gray-800 dark:text-gray-100">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (max 800x400px)
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoInputChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block font-semibold mb-2">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 dark:bg-gray-800"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block font-semibold mb-2">
                  Industry Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 dark:bg-gray-800"
                >
                  <option value="">Select industry</option>
                  <option value="IT">IT / Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Contact */}
              {/* <div>
                <label className="block font-semibold mb-2">Contact Info</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 dark:bg-gray-800"
                />
              </div> */}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Save Details"
                )}
              </button>

            </form>
          </div>
        </main>

        {/* <footer className="w-full mt-2 text-center text-gray-700 dark:text-gray-300 py-4 text-sm">
          © 2025 Uptoskills. Built by learners.
        </footer> */}
      </div>
      <footer
        className="w-full mt-2 text-gray-700   dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 text-center py-4 text-sm transition-colors duration-300 "
      >
        <p>© 2025 Uptoskills. Built by learners.</p>
      </footer>
    </>
  );
}
