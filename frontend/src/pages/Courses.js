import React from 'react';
import '../App.css';
import hack from '../assets/hack.png';
import webdev from '../assets/webdev.png';
import python from '../assets/pythton.png';
import { Link } from 'react-router-dom';

const Courses = () => {
  const coursediv = [
    {
      img: hack,
      heading: "Ethical Hacking",
      courseinfo: "Master cybersecurity, penetration testing, and ethical hacking techniques."
    },
    {
      img: webdev,
      heading: "Frontend Development",
      courseinfo: "Build responsive websites using HTML, CSS, JavaScript, and React."
    },
    {
      img: python,
      heading: "Python Programming",
      courseinfo: "Learn Python from scratch for automation, data, and AI projects."
    },
    {
      img: hack,
      heading: "Mern Stack Devlopment",
      courseinfo: "Understand network security, firewalls, and modern defense strategies."
    }
  ];

  return (
    <div className="courses">
      <h1>Explore Our Master Courses</h1>

      <div className="explore">
        <Link to={"/courses"}>Explore More →</Link>
      </div>

      <div className="coursecontainer">
        {coursediv.map((course, index) => (
          <div key={index} className="course-card">
            <div className="card-img">
              <img src={course.img} alt={course.heading} />
            </div>
            <div className="card-content">
              <h3>{course.heading}</h3>
              <p>{course.courseinfo}</p>
              <button className="enroll-btn"><Link to={'/courses'}>Enroll Now</Link></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
