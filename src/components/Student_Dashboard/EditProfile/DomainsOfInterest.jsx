import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const DOMAIN_OPTIONS = [
  'Web Development',
  'Full Stack Development',
  'AI',
  'ML',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
  'Blockchain',
  'App Development',
];

const DomainsOfInterest = ({ selectedDomains = [], onChange, othersValue = '' }) => {
  const { darkMode: isDarkMode } = useTheme();
  // Handle checkbox selection
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    onChange(value, checked); // pass domain + whether it’s checked
  };

  // Handle "Others" text field
  const handleOthersChange = (e) => {
    onChange('others', e.target.value); // use 'others' as key
  };

  return (
    <div className={`domains-container p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : ''}`}>Domains of Interest</h3>

      {/* Domain Checkboxes */}
      <div className="domains-list grid grid-cols-2 gap-4 mb-4">
        {DOMAIN_OPTIONS.map((domain) => (
          <div key={domain} className="form-group checkbox-group flex items-center space-x-2">
            <input
              type="checkbox"
              id={`domain_${domain}`}
              value={domain}
              checked={selectedDomains.includes(domain)}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={`domain_${domain}`} className={`${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
              {domain}
            </label>
          </div>
        ))}
      </div>

      {/* Others Field */}
      <div className="form-group">
        <label htmlFor="others" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>
          Others
        </label>
        <input
          type="text"
          id="others"
          name="others"
          value={othersValue}
          onChange={handleOthersChange}
          placeholder="Please specify other domains"
          className={`w-full px-3 py-2 border rounded-lg text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 bg-white'}`} 
        />
      </div>
    </div>
  );
};

export default DomainsOfInterest;
