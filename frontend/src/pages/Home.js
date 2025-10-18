import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Courses from './Courses.js';
import Language from './Languages.js';
import StudentsReview from './studentsreview.js';
import Footer from '../components/Footer.js';

const Home = () => {
  return (
    <>
      <div className='homebody'>
      <div className="hero-content">
        <h1>Want To Become</h1>
        <p className='heading'><span>Become a</span> Certified Ethical Hacker</p>
        <p>Join our Master Class and unlock the secrets of coding, hacking, and tech mastery.
Watch our videos, learn from experts, and take your skills to the next level</p>
        <button className='cta-button'><Link to="/register">Get Started</Link></button>
      </div>
    </div>
     <Courses />
     <Language />
     <StudentsReview />
     <Footer />
    </>

  )
}

export default Home