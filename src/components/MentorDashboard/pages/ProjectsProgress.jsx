// src/pages/ProjectsProgress.jsx

import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";

// Static student progress data (mock data for UI display)
const students = [
  {
    name: "Angat Mali",
    email: "angat.mali@example.com",
    project: "Learning Platform",
    avatar: "https://i.pravatar.cc/150?img=1",
    progress: 80,
  },
  {
    name: "Pragya Jha",
    email: "pragya.jha@example.com",
    project: "Portfolio Website",
    avatar: "https://i.pravatar.cc/150?img=2",
    progress: 60,
  },
  {
    name: "Freddy Fernandes",
    email: "freddy.fernandes@example.com",
    project: "Mobile App",
    avatar: "https://i.pravatar.cc/150?img=3",
    progress: 75,
  },
  {
    name: "Pravin Goswami",
    email: "pravin.goswami@example.com",
    project: "Learning Platform",
    avatar: "https://i.pravatar.cc/150?img=4",
    progress: 20,
  },
  {
    name: "Shruti Biradar",
    email: "shruti.biradar@example.com",
    project: "Learning Platform",
    avatar: "https://i.pravatar.cc/150?img=5",
    progress: 50,
  },
];

const ProjectsProgress = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div className="mt-14 flex">

      {/* 🔹 Top Header (includes dark mode toggle) */}
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* 🔹 Sidebar Navigation */}
      <Sidebar isDarkMode={isDarkMode} />

      {/* 🔹 Main dashboard area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

        {/* ---- Page Title + Subtitle ---- */}
        <div className="text-center mb-10 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Track Assigned Students and Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage the students assigned to you with detailed profiles
            and progress logs.
          </p>
        </div>

        {/* ---- Students Progress Table ---- */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mx-8 transition-colors">
          <table className="w-full text-left text-gray-900 dark:text-gray-200">

            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Progress</th>
              </tr>
            </thead>

            {/* Table Body – renders student rows */}
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none border-gray-300 dark:border-gray-600"
                >
                  {/* ---- Student Info with Avatar ---- */}
                  <td className="py-4 px-4 flex items-center">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {student.email}
                      </p>
                    </div>
                  </td>

                  {/* ---- Project Name ---- */}
                  <td className="py-4 px-4">{student.project}</td>

                  {/* ---- Progress Bar ---- */}
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>

                    {/* Progress % below bar */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {student.progress}%
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* ---- Footer ---- */}
        <div className="mt-auto">
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default ProjectsProgress;
