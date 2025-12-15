import React from 'react';
import heroSectionImg from "../../assets/her0Section.jpeg";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const goToRegister = () => navigate("/register");
  const goToCompanyRegister = () => navigate("/register?role=company");
  const goToMentorRegister = () => navigate("/register?role=mentor");
  return (
    <section
      id="home"
      className={`flex flex-col justify-start items-center p-8 h-auto min-h-screen md:h-screen md:flex-row md:justify-between md:p-16 md:px-20 animate-[fadeInUp_0.5s_ease-out] transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <div className="max-w-[40rem] mt-10 md:mt-0">
        <h1 className={`text-[34px] font-bold leading-[1.2] ${darkMode ? "text-white" : "text-gray-900"}`}>
          Master Tech Skills with Peer-to-Peer Learning
        </h1>
        <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-[#64748b]"}`}>
          Join a global community to learn cutting-edge tech skills, collaborate
          on real-world projects, and accelerate your career with expert
          mentorship.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
          onClick={goToCompanyRegister}
          className="bg-[#FF6A28] text-white px-6 py-3 rounded-full font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1)] border-none cursor-pointer transition-all duration-300 ease hover:bg-[#00C7B1]">
            Explore Talent
          </button>
          <button
          onClick={goToMentorRegister}
          className="bg-[#FF6A28] text-white px-6 py-3 rounded-full font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1)] border-none cursor-pointer transition-all duration-300 ease hover:bg-[#00C7B1]">
            Guide & Earn
          </button>
          <button
          onClick={goToRegister}
          className="bg-[#FF6A28] text-white px-6 py-3 rounded-full font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1)] border-none cursor-pointer transition-all duration-300 ease hover:bg-[#00C7B1]">
          Join as Learner
          </button>
        </div>
      </div>
      <div className="mt-10 md:mt-0">
        <img
          src={heroSectionImg}
          alt="Education"
          className="w-[20rem] md:w-[35rem] rounded-xl transition-transform duration-300 ease hover:scale-[1.03]"
        />
      </div>
    </section>
  );
};

export default HeroSection;


