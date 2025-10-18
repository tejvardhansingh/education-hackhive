import React from "react";
import "../App.css";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* About / Brand */}
        <div className="footer-about">
          <h2>HackHive</h2>
          <p>
            Learn, build, and hack ethically. Join our courses to level up your skills in web
            development, cybersecurity, and AI.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: info@hackhive.com</p>
          <p>Phone: +91 1234567890</p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaGithub /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} HackHive. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
