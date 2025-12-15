// src/pages/CoursesList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CoursesList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/courses");
                setCourses(res.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 dark:text-gray-300 text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10">
                Our Courses
            </h1>

            {courses.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No courses available yet.
                </p>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
                        >
                            {/* Image */}
                            <img src={`http://localhost:5000${course.image_path}`} alt={course.title} />


                            {/* Content */}
                            <div className="p-5 flex flex-col justify-between h-[250px]">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                                        {course.description}
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <a
                                        href={course.enroll_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                    >
                                        Explore Now →
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
