import React from 'react';

const FormActions = () => {
  // Function to reset the form by reloading the page
  const handleReset = () => {
    window.location.reload();
  };

  // Function to simulate saving the form
  const handleSave = () => {
    alert('Form saved successfully!');
  };

  return (
    <div className="flex gap-3 mt-6 form-actions">
      {/* Reset Button */}
      <button
        className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold transition-colors duration-300 hover:bg-gray-300 focus:outline-none"
        onClick={handleReset}
      >
        Reset
      </button>

      {/* Save Button */}
      <button
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold transition-transform duration-200 hover:bg-blue-700 hover:scale-105 focus:outline-none"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default FormActions;
