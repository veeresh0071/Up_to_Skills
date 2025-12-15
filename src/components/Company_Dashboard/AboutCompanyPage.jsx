import React from "react";
import { BriefcaseIcon, Users, Target } from "lucide-react";
import { motion } from "framer-motion";
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import Footer from "../../components/AboutPage/Footer";

export default function AboutCompanyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Main content area */}
      <div className="flex-grow pt-20 px-2 sm:px-4 py-6 w-full">

        {/* Card for About section */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 w-full border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with icon and title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#FB923C] text-white shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                  About UptoSkill
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Empowering hiring teams to discover, evaluate and hire great student talent.
                </p>
              </div>
            </div>
            <BriefcaseIcon className="w-8 h-8 text-orange-500" />
          </div>

          {/* Mission and Values section in two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 border-l-4 border-orange-500 pl-3">
                Our Mission
              </h2>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                UptoSkill exists to shorten the gap between emerging technical talent and companies
                looking to hire them. We build tools and experiences that help companies discover
                capable students, run structured interviews, and make bias-reduced hiring decisions —
                all from a single, straightforward dashboard.
              </p>

              {/* Extra info about company */}
              <div className="mt-6 border-t pt-6 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Founded with the goal of making early-career hiring efficient and fair, UptoSkill blends
                  practical recruitment tools with student-centered features to help both sides succeed.
                  If you'd like a demo or have partnership inquiries, reach out via your company profile contact.
                </p>
              </div>

              <h3 className="mt-4 text-md font-semibold text-gray-700 dark:text-gray-200">
                What we do
              </h3>
              <ul className="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                <li>Aggregate and surface student profiles with skill summaries and badges.</li>
                <li>Provide scheduling and interview management tools for hiring teams.</li>
                <li>Offer customizable candidate filters to quickly find the right match.</li>
              </ul>
            </section>

            {/* Values */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 border-l-4 border-orange-400 pl-3">
                Values & Approach
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We care about transparency, speed, and fairness. Our platform is designed to surface
                objective signals (projects, domain badges, skill summaries) and to reduce manual
                overhead so companies can focus on interviewing and mentoring.
              </p>

              {/* Target audience card */}
              <div className="mt-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
                  <Target className="w-4 h-4" /> Who should use UptoSkill
                </h4>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  Hiring managers, small to medium recruitment teams, and companies seeking early-career
                  engineering and product talent will find UptoSkill especially useful.
                </p>
              </div>
            </section>
          </div>
        </motion.div>

        {/* Contact info section */}
         <section className="mt-12 mb-12 text-center">
          <p className="text-orange-500 text-3xl font-bold uppercase tracking-wide mb-3">
            Our Contacts
          </p>

          <h2 className="font-normal text-gray-900 text-lg dark:text-white mb-6">
            We're here to Help You
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Reach out to us anytime — our team is happy to assist you with inquiries, collaborations, or support.
          </p>

          {/* Phone and Email cards */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-5xl mx-auto">
     
            {/* Phone */}
            <a href="tel:+919319772294">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-transform">
                <FaPhone className="text-[#F97316] mx-auto mb-4" size={40} />
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                  Phone Us 24/7
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  +91 (931) 977 2294
                </p>
              </div>
            </a>

            {/* Email */}
            <a
              href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=DmwnWrRpctPQbXNFtntrNcJqHZhhCzgrmTlQmCzbLtpmfMxDWlctnGFFgpGsCfrDMfkFmDBTtkRV"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-transform">
                <FaEnvelope className="text-[#F97316] mx-auto mb-4" size={40} />
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                  Mail Us 24/7
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  info@uptoskills.com
                </p>
              </div>
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
