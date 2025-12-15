import { useTheme } from "../../context/ThemeContext";

const ProjectModal = ({ project, onClose, isDarkMode: propIsDarkMode }) => {
  const { darkMode: contextDarkMode } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextDarkMode;

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" onClick={onClose} style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.5)' }} />
      <div className={`relative p-7 rounded-2xl shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900 border border-gray-700 text-gray-100' : 'bg-white'}`}>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 px-3 py-1 rounded-md text-sm ${isDarkMode ? 'text-gray-300 bg-transparent' : 'text-gray-700 bg-transparent'}`}
        >
          Close
        </button>

        {/* Modal Content */}
        <div className="flex gap-6">
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{project.title}</h2>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-200' : ''}`}>{project.projectType}</h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{project.description}</p>

            {/* GitHub Button */}
            <a
              href={project.github || "https://github.com/dummy-project-link"}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block px-4 py-2 rounded text-sm transition ${isDarkMode ? 'text-white bg-indigo-600 hover:bg-indigo-500' : 'text-white bg-[#00b2a9] hover:bg-orange-500'}`}
            >
              View on GitHub
            </a>

            {/* Date and Duration in one line */}
            {(project.date || project.duration) && (
              <div className={`flex justify-start gap-4 text-sm mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {project.date && (
                  <p>
                    <span className="font-semibold">Date:</span> {project.date}
                  </p>
                )}
                {project.duration && (
                  <p>
                    <span className="font-semibold">Duration:</span> {project.duration}
                  </p>
                )}
              </div>
            )}

            {/* Contributors - Centered Heading & Inline */}
            {project.contributors && project.contributors.length > 0 && (
              <div className="w-full mt-4 text-left">
                <h3 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-gray-200' : ''}`}>Contributors</h3>
                <div className={`flex flex-wrap gap-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {project.contributors.map((name, idx) => (
                    <span key={idx} className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={`w-56 h-36 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {project.image ? (
              <img src={project.image} alt="project image" className="object-cover w-full h-full rounded-lg" />
            ) : (
              <div className={isDarkMode ? 'text-gray-400' : 'text-gray-400'}>No image</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;