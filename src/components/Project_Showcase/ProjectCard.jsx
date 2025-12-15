import { FaCode, FaGithub } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const ProjectCard = ({ project, onClick, isDarkMode: propIsDarkMode }) => {
  const { darkMode: contextDarkMode } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextDarkMode;

  return (
    <div className={`border rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-b from-white to-gray-50 border-gray-200'}`}>
      {/* Title */}
      <h2 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        {project.title}
      </h2>
      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {project.description || "No description provided."}
      </p>

      {/* Tech tags */}
      {project.tech_stack && (
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tech_stack.split(",").map((tech, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-50 text-cyan-700'}`}
            >
              <FaCode className="text-cyan-500" />
              {tech.trim()}
            </span>
          ))}
        </div>
      )}


      {/* GitHub */}
      {project.github_pr_link && (
        <a
          href={project.github_pr_link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 text-sm mb-4 ${isDarkMode ? 'text-cyan-300 hover:underline' : 'text-blue-600 hover:underline'}`}
        >
          <FaGithub /> GitHub Repository
        </a>
      )}

      {/* View Details */}
      
    </div>
  );
};

export default ProjectCard;
