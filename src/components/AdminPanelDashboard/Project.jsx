import React, { useState, useEffect } from "react";
import { 
  FolderOpen, 
  User, 
  Users, 
  Trash2, 
  Search, 
  Loader2, 
  Eye, 
  X, 
  Mail, 
  Calendar,
  GitBranch,
  Code,
  Award,
  ExternalLink,
  Github,
  AlertCircle
} from "lucide-react";

export default function Project({ isDarkMode }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    isDarkMode ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDarkMode]);

  // Fetch all projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        setProjects(data.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredProjects = projects.filter((proj) => {
    const search = searchTerm.toLowerCase();
    return (
      proj.title?.toLowerCase().includes(search) ||
      proj.full_name?.toLowerCase().includes(search) ||
      proj.tech_stack?.toLowerCase().includes(search)
    );
  });

  const viewProjectDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setShowDeleteConfirm(false);
        setDeleteId(null);
      } else {
        alert("Failed to delete project");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  return (
    <main
      className={`p-4 sm:p-6 flex flex-col gap-6 transition-colors duration-300 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl font-extrabold">Student Projects</h1>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            View and manage all student project submissions
          </p>
        </div>
        
        <div className={`px-4 py-2 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-sm`}>
          <span className="text-2xl font-bold text-indigo-500">{projects.length}</span>
          <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Total Projects
          </span>
        </div>
      </div>

      {/* ---------------- SEARCH BAR (FIXED & WORKING) ---------------- */}
      <div
        className={`p-4 shadow-md rounded-lg border transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Search by title, student name, or tech stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-2 rounded-lg outline-none transition-colors ${
              isDarkMode
                ? "bg-gray-900 text-white placeholder-gray-500 border border-gray-700"
                : "bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300"
            }`}
          />
        </div>
      </div>
      {/* -------------------------------------------------------------- */}

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className={`text-center py-20 rounded-xl border-2 border-dashed ${
          isDarkMode ? "border-gray-700" : "border-gray-300"
        }`}>
          <FolderOpen className={`w-16 h-16 mx-auto mb-4 ${
            isDarkMode ? "text-gray-700" : "text-gray-300"
          }`} />
          <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {searchTerm ? `No projects match "${searchTerm}"` : "No projects found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isDarkMode={isDarkMode}
              onViewDetails={() => viewProjectDetails(project)}
              onDelete={() => {
                setDeleteId(project.id);
                setShowDeleteConfirm(true);
              }}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {showDetailsModal && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isDarkMode={isDarkMode}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProject(null);
          }}
          formatDate={formatDate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          isDarkMode={isDarkMode}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteId(null);
          }}
        />
      )}
    </main>
  );
}


// ---------------------- Project Card Component ----------------------
function ProjectCard({ project, isDarkMode, onViewDetails, onDelete, formatDate }) {
  return (
    <div
      className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:border-indigo-500"
          : "bg-white border-gray-200 hover:border-indigo-300"
      }`}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{project.title}</h3>
          {project.is_open_source && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Award className="w-3 h-3" />
              Open Source
            </span>
          )}
        </div>
      </div>

      {/* Student Info */}
      <div className={`mb-4 pb-4 border-b ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-sm">{project.full_name || "Unknown"}</span>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-wide">Tech Stack</span>
        </div>
        <p className={`text-sm line-clamp-2 ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}>
          {project.tech_stack || "Not specified"}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          {formatDate(project.created_at)}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onViewDetails}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-gray-700 text-blue-400"
                : "hover:bg-blue-50 text-blue-600"
            }`}
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <button
            onClick={onDelete}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-gray-700 text-red-400"
                : "hover:bg-red-50 text-red-600"
            }`}
            title="Delete Project"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}


// ---------------------- Project Details Modal ----------------------
function ProjectDetailsModal({ project, isDarkMode, onClose, formatDate }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Modal Header */}
        <div className={`sticky top-0 z-10 p-6 border-b flex justify-between items-start ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
            {project.is_open_source && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Award className="w-4 h-4" />
                Open Source Project
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">

          {/* Student Information */}
          <div className={`p-4 rounded-lg ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-semibold">{project.full_name || "Not provided"}</p>
              </div>

            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold mb-2">Description</h3>
            <p className={`leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              {project.description || "No description provided"}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-500" />
              Technology Stack
            </h3>
            <p className={`leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              {project.tech_stack || "Not specified"}
            </p>
          </div>

          {/* Contributions */}
          {project.contributions && (
            <div>
              <h3 className="text-lg font-bold mb-2">Contributions</h3>
              <p className={`leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                {project.contributions}
              </p>
            </div>
          )}

          {/* GitHub Link */}
          {project.github_pr_link && (
            <div>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub Repository
              </h3>
              <a
                href={project.github_pr_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Submission Date */}
          <div className={`p-4 rounded-lg ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Submitted On</p>
                <p className="font-semibold">{formatDate(project.created_at)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// ---------------------- Delete Confirmation Modal ----------------------
function DeleteConfirmModal({ isDarkMode, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl p-8 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <div className={`flex justify-center mb-6 p-4 rounded-full w-fit mx-auto ${
          isDarkMode ? "bg-red-500/10" : "bg-red-50"
        }`}>
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        <h2 className="text-xl font-bold mb-2 text-center">Delete Project?</h2>
        <p className={`text-sm mb-8 text-center ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          This action cannot be undone. The project will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
