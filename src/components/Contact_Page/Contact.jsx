import React, { useState } from 'react';
import InputField from './InputField';
import {Link} from 'react-router-dom';
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import useSubmitContactForm from '../../hooks/useSubmitContactForm';
import { useTheme } from '../../context/ThemeContext';

const Contact = () => {
  const { submitForm, loading, response, error } = useSubmitContactForm();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: '',
    message: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm('http://localhost:5000/api/form/contact', formData);
  };

  return (
    <>
      {/* Contact Info Section */}
      <section className={`w-full mx-auto py-16 px-4 text-center transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <p className="text-orange-500 font-semibold uppercase">Our Contacts</p>
        <h2 className={`text-4xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>We're here to Help You</h2>
        <p className={`mt-4 max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Got a query in mind? We'd love to provide you solution for it. Take a minute to fill out the form below  
          so that we can get to know you and understand your query.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <a href="https://www.linkedin.com/company/uptoskills/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
            <div className={`rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <FaLinkedin className="text-orange-500 mx-auto mb-4" size={40} />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Get to Know Us:</h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>www.Linked In.com</p>
            </div>
          </a>
          <a href="tel:+919319772294">
            <div className={`rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <FaPhone className="text-orange-500 mx-auto mb-4" size={40} />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Phone Us 24/7:</h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>+91 (931) 977 2294</p>
            </div>
          </a>

          <a href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=DmwnWrRpctPQbXNFtntrNcJqHZhhCzgrmTlQmCzbLtpmfMxDWlctnGFFgpGsCfrDMfkFmDBTtkRV" target="_blank" rel="noopener noreferrer">
            <div className={`rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <FaEnvelope className="text-orange-500 mx-auto mb-4" size={40} />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Mail Us 24/7:</h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>info@uptoskills.com</p>
            </div>
          </a>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className={`w-full mx-auto py-16 px-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Send Us a Message</h2>
            <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Have some suggestions or just want to say hi? Contact us:</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField id="name" type="text" label="Your Name *" placeholder="Your Name" value={formData.name} onChange={handleChange} isRequired darkMode={darkMode} />
              <InputField id="email" type="email" label="Your Email *" placeholder="Your Email" value={formData.email} onChange={handleChange} isRequired darkMode={darkMode} />
              <div className="relative w-full">
                <select
                  id="inquiryType"
                  name="inquiryType"
                  required
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className={`peer w-full border py-3 px-4 rounded-xl focus:outline-none focus:border-orange-500 ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-zinc-300 text-zinc-900"}`}
                >
                  <option value="" disabled hidden>Select Inquiry Type</option>
                  <option value="student">Student Inquiry</option>
                  <option value="company">Company Partnership</option>
                  <option value="general">General Support</option>
                </select>
                <label htmlFor="inquiryType" className={`absolute left-4 top-3 text-base transition-all px-1 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-orange-500 peer-valid:top-[-10px] peer-valid:text-sm peer-valid:text-orange-500 ${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-zinc-500"}`}>
                  Select Inquiry Type
                </label>
              </div>
              <InputField id="message" label="Message" placeholder="Message..." value={formData.message} onChange={handleChange} textarea darkMode={darkMode} />
              <button type="submit" className="bg-orange-500 hover:bg-[#09C3A1] text-white font-semibold px-6 py-3 rounded-md transition-all duration-300" disabled={loading}>
                {loading ? 'Sending...' : 'Send a Message'}
              </button>
              {error && <p className="text-red-500">{error}</p>}
              {response && <p className="text-green-500">Message sent successfully!</p>}
            </form>
          </div>
          <div className="flex justify-center">
            <img src="/contact-illustration.png" alt="Contact Support Illustration" className="w-[90%] max-w-md md:max-w-full" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
