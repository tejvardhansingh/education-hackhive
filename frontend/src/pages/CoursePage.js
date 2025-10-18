import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { courses as allCourses } from "../data/courses";

const CoursesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ added state for search

  const categories = [
    "All Categories",
    "Frontend",
    "Backend",
    "Fullstack",
    "Data Science",
  ];
  const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  const courses = allCourses;

  // ✅ Updated filter logic
  const filteredCourses = courses.filter(
    (course) =>
      (selectedCategory === "All Categories" ||
        course.category === selectedCategory) &&
      (selectedDifficulty === "All Levels" ||
        course.difficulty === selectedDifficulty) &&
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  return (
    <section className="dark-courses-section">
      <header className="dark-courses-header">
        <h2>Our Courses</h2>
        <p>Expert-led courses to take your skills from beginner to professional level.</p>
      </header>

      <div className="dark-courses-wrapper">
        {/* Sidebar (Filters) */}
        <aside className="dark-courses-filters-sidebar">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // ✅ handles search input
          />

          <div className="dark-filter-select">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="dark-filter-select">
            <label>Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Courses Grid */}
        <div className="dark-courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, idx) => (
              <div key={idx} className="dark-course-card">
                <div className="dark-course-header">
                  <h3>{course.title}</h3>
                  <span>{course.duration}</span>
                </div>
                <p>{course.description}</p>
                <div className="dark-course-tags">
                  {course.tags.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>
                <button className="dark-get-course-btn">
                  <Link to={`/course?title=${encodeURIComponent(course.title)}`}>
                    Get Course
                  </Link>
                </button>
              </div>
            ))
          ) : (
            <p className="no-results">No courses found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
