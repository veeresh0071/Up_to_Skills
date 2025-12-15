import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const faqData = {
  Students: [
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button and fill in your details. You'll get a confirmation email to activate your account."
    },
    {
      question: "Is there a fee to join?",
      answer: "No, creating a student account is completely free."
    },
    {
      question: "Can I save job listings to view later?",
      answer: "Yes, you can bookmark job postings for quick access."
    }
  ],
  Companies: [
    {
      question: "How do I register my company?",
      answer: "Select 'Company Sign Up', enter your details, and verify your email to get started."
    },
    {
      question: "What's the cost for posting job openings?",
      answer: "We offer both free and premium posting options. Check our pricing page for details."
    },
    {
      question: "Can I search for candidates?",
      answer: "Yes, premium members have access to our candidate database for proactive searching."
    }
  ]
};

const FAQAccordion = ({ section, faqs, darkMode }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>{section} FAQs</h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`rounded-lg shadow transition-shadow duration-200 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            onMouseEnter={() => setOpenIndex(idx)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            <button
              onClick={() => handleToggle(idx)}
              className={`flex items-center justify-between w-full p-4 font-medium text-lg text-left focus:outline-none ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              <span>{faq.question}</span>
              <span className="text-orange-500 text-2xl font-bold ml-3 transition-transform">
                {openIndex === idx ? "−" : "+"}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
                ${openIndex === idx ? "max-h-40 opacity-100 px-4 py-3" : "max-h-0 opacity-0 px-4 py-0"}`}
            >
              <div className={darkMode ? "text-gray-400" : "text-gray-700"}>{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Faq = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`py-16 px-4 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <h1 className={`text-4xl font-extrabold text-center mb-12 max-sm:text-3xl ${darkMode ? "text-white" : "text-gray-800"}`}>Frequently Asked Questions</h1>

      <div className="max-w-[1280px] mx-auto flex flex-col gap-10 lg:flex-row lg:justify-center">
        <FAQAccordion section="Students" faqs={faqData.Students} darkMode={darkMode} />
        <FAQAccordion section="Companies" faqs={faqData.Companies} darkMode={darkMode} />
      </div>
    </section>
  );
};

export default Faq;
