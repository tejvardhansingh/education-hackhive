import React from "react";
import "../App.css";

/* Replace these with your own images */
import student1 from "../assets/student.webp";
import student2 from "../assets/student.webp";
import student3 from "../assets/student.webp";

const reviews = [
  {
    name: "Aarav Sharma",
    course: "Full Stack Web Development",
    review:
      "This course completely changed my understanding of web technologies. The mentors were super helpful and projects were real-world level!",
    img: student1,
  },
  {
    name: "Priya Nair",
    course: "UI/UX Design",
    review:
      "The UI/UX course helped me build a portfolio that got me my first internship. The lessons on Figma and design systems were excellent!",
    img: student2,
  },
  {
    name: "Rohan Mehta",
    course: "Python for Cybersecurity",
    review:
      "Hands-on learning with real attack simulations. Loved the practical projects using Kali Linux and Python scripting!",
    img: student3,
  },
  
];

const StudentsReview = () => {
  return (
    <section className="reviews-section">
      <h2 className="reviews-title">💬 What Our Students Say</h2>
      <div className="reviews-container">
        {reviews.map((rev, index) => (
          <div key={index} className="review-card">
            <div className="review-avatar">
              <img src={rev.img} alt={rev.name} />
            </div>
            <h3>{rev.name}</h3>
            <p className="review-course">{rev.course}</p>
            <p className="review-text">“{rev.review}”</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentsReview;
