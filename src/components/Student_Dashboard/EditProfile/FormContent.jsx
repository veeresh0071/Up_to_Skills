import React from 'react';
import BasicInformation from './BasicInformation';
import ProfessionalDetails from './ProfessionalDetails';
import Skills from './Skills';
import ContactInformation from './ContactInformation';
import Resume from './Resume';
import FormActions from './FormActions';

const FormContent = () => {
  return (
    // Main container for the form content with responsive grid layout
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 form-content">
      
      {/* Left column containing basic and professional information sections */}
      <div className="form-left space-y-8">
        <BasicInformation />
        <ProfessionalDetails />
      </div>

      {/* Right column containing skills, contact info, resume upload, and form actions */}
      <div className="form-right space-y-8">
        <Skills />
        <ContactInformation />
        <Resume />
        <FormActions />
      </div>
    </div>
  );
};

export default FormContent;
