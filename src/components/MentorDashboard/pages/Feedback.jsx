import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Feedback = ({ isDarkMode, setIsDarkMode }) => {
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [studentsError, setStudentsError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadStudents = async () => {
            setLoadingStudents(true);
            setStudentsError(null);
            try {
                // Uses same source as mentor skill badge autocomplete
                const res = await axios.get("http://localhost:5000/api/students/autocomplete");
                const data = Array.isArray(res.data) ? res.data : [];
                if (!isMounted) return;

                setStudents(data);
                if (!selectedStudent && data.length > 0) {
                    setSelectedStudent(data[0].name);
                }
            } catch (err) {
                console.error("Error fetching students:", err);
                if (!isMounted) return;
                setStudents([]);
                setStudentsError("Failed to load students.");
            } finally {
                if (isMounted) setLoadingStudents(false);
            }
        };

        loadStudents();

        return () => {
            isMounted = false;
        };
        // selectedStudent intentionally not a dependency to avoid resetting user choice
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mt-14 flex min-h-screen">
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <Sidebar isDarkMode={isDarkMode} />

            {/* Main content area */}
            <div className="flex flex-col flex-1">
                <main className="flex-1 px-6 md:px-16 py-10 bg-white overflow-y-auto">
                    <h1 className="text-3xl md:text-4xl font-semibold text-center mb-2">
                        Feedback & Approvals
                    </h1>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
                        Guide and support your students' milestones through approval and
                        thought-provoking feedback.
                    </p>

                    <form className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        {/* Student Selector */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                            <label className="text-lg font-medium mb-2 md:mb-0">Student</label>
                            <select
                                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                disabled={loadingStudents || !!studentsError}
                            >
                                {loadingStudents ? (
                                    <option value="">Loading students...</option>
                                ) : studentsError ? (
                                    <option value="">{studentsError}</option>
                                ) : students.length === 0 ? (
                                    <option value="">No students found</option>
                                ) : (
                                    students.map((s) => (
                                        <option key={s.id} value={s.name}>
                                            {s.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Milestone */}
                        <div className="mb-6">
                            <label className="block text-lg font-medium mb-2">Milestone</label>
                            <input
                                type="text"
                                placeholder="Enter milestone"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            />
                        </div>

                        {/* Feedback */}
                        <div className="mb-6">
                            <label className="block text-lg font-medium mb-2">Feedback</label>
                            <textarea
                                rows="8"
                                placeholder="Enter feedback"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            ></textarea>
                        </div>

                        {/* Approve Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="text-white bg-blue-600 px-4 py-2 rounded shadow hover:bg-blue-700 transition duration-300"
                            >
                                Approve
                            </button>
                        </div>
                    </form>
                </main>

                {/* Footer aligned at bottom, full width */}
                <Footer />
            </div>
        </div>
    );
};

export default Feedback;
