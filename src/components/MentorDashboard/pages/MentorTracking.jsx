// src/pages/ProjectsProgress.jsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // adjust path if needed
import Footer from "../components/Footer";
import Header from "../components/Header";

const avatarFor = (seed) => {
  // Keep UI consistent without storing avatars in DB
  const str = String(seed || "mentor");
  const hash = Array.from(str).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const img = (hash % 70) + 1; // pravatar has many images
  return `https://i.pravatar.cc/150?img=${img}`;
};

const ProjectsProgress = ({ isDarkMode, setIsDarkMode }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) Fetch mentor projects (no token required)
        const projectsRes = await axios.get(
          "http://localhost:5000/api/mentor_projects"
        );
        const projectsData = projectsRes.data;
        const projects = Array.isArray(projectsData?.data)
          ? projectsData.data
          : [];

        // 2) Optionally enrich with mentor emails (token required)
        let mentorByName = new Map();
        if (token) {
          try {
            const mentorsRes = await axios.get(
              "http://localhost:5000/api/mentors",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const mentorsData = mentorsRes.data;
            const mentors = Array.isArray(mentorsData?.mentors)
              ? mentorsData.mentors
              : [];
            mentorByName = new Map(
              mentors
                .filter((m) => m?.full_name)
                .map((m) => [m.full_name, m])
            );
          } catch (innerErr) {
            // Non-fatal: page can still render without email enrichment
            console.warn("Mentor enrichment failed:", innerErr);
          }
        }

        const mapped = projects.map((p) => {
          const mentor = mentorByName.get(p.mentor_name);
          return {
            id: p.id,
            name: p.mentor_name || "—",
            email: mentor?.email || "—",
            project: p.project_title || "—",
            avatar: avatarFor(p.mentor_name || p.id),
          };
        });

        setRows(mapped);
      } catch (err) {
        console.error("Error fetching mentor tracking data:", err);
        setRows([]);
        setError("Failed to load tracking data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  return (
    <div className="mt-14 flex">

      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      {/* Sidebar */}
      <Sidebar isDarkMode={isDarkMode} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="text-center mb-10 p-8">
          <h1 className="text-3xl font-bold">Track Assigned Mentors</h1>
          <p className="text-gray-600 mt-2">
            View and manage the mentors assigned to you and the projects they oversee.
          </p>
        </div>

        {/* Card/Table */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mx-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4">Mentor</th>
                <th className="py-3 px-4">Project</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-4 px-4 text-gray-600" colSpan={2}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="py-4 px-4 text-red-600" colSpan={2}>
                    {error}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="py-4 px-4 text-gray-600" colSpan={2}>
                    No records found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id ?? `${row.name}-${row.project}`} className="border-b last:border-none">
                    {/* Mentor */}
                    <td className="py-4 px-4 flex items-center">
                      <img
                        src={row.avatar}
                        alt={row.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-sm text-gray-500">{row.email}</p>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="py-4 px-4">{row.project}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProjectsProgress;