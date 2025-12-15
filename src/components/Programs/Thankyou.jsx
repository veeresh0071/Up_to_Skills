import React from 'react'
import Header from '../AboutPage/Header'
import { useTheme } from '../../context/ThemeContext';

const Thankyou = () => {
    const { darkMode } = useTheme();

    return (
        <div className={`h-screen flex flex-col transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200"}`}>
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center">
                <div className={`rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full animate-fade-in ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <img src="/uptoskills_logo.png" alt="Thank You" className="mb-6" />
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mb-3 drop-shadow-lg">Thank You!</h1>
                    <p className={`text-xl mb-6 text-center font-medium ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                        Your submission was <span className="text-blue-500 font-bold">successful</span>.<br />
                        We appreciate your interest in <span className="text-purple-500 font-bold">UpToSkills</span>.<br />
                        Our team will contact you soon!
                    </p>
                    <div className="flex gap-6 mt-6">
                        <a href="/" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-7 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200">Home</a>
                        <a href="/programs" className={`border-2 px-7 py-3 rounded-xl font-semibold shadow-lg transition-colors duration-200 ${darkMode ? "bg-gray-700 border-purple-500 text-purple-400 hover:bg-gray-600" : "bg-white border-purple-400 text-purple-700 hover:bg-purple-50"}`}>Explore Programs</a>
                    </div>
                </div>
            </main>
            <footer className={`w-full text-center py-4 text-sm transition-colors duration-300 border-t ${darkMode ? "bg-gray-950 text-gray-300 border-gray-700" : "bg-gray-700 text-gray-100 border-gray-300"}`}>
                <p>© 2025 Uptoskills. Built by learners.</p>
            </footer>
        </div>
    )
}

export default Thankyou
