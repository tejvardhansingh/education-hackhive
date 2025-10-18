import React, { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import jwt from 'jsonwebtoken';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(""); // Clear previous messages

  if (formData.password !== formData.confirmPassword) {
    setMessage("Passwords do not match ❌");
    return;
  }

  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/users/register",
      formData
    );

    const successMsg = data.message || "Registered successfully ✅";
    setMessage(successMsg);
    console.log(successMsg);

    // Reset form
    setFormData({
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    navigate("/login"); // Navigate to login page
  } catch (err) {
    console.error(err);

    const error = err.response?.data;
    let errorMessage = "Registration failed ❌";

    if (error) {
      if (typeof error === "string") errorMessage = error;
      else if (error.message) errorMessage = error.message;
      else if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || "account";
        errorMessage = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
      } else if (error.errors) {
        const firstError = Object.values(error.errors)[0];
        errorMessage = firstError?.message || "Validation error occurred.";
      } else {
        errorMessage = "Please check your input and try again.";
      }
    } else {
      errorMessage = err.message || "Network error ❌";
    }

    setMessage(errorMessage);
  }
};


  return (
    <div className="large">
      <div className="loginContainer dark">
        <div className="welcomeSection">
          <h1>Join the Revolution 🚀</h1>
          <p>Create your account and start coding greatness.</p>
        </div>

        <form className="loginForm" onSubmit={handleSubmit}>
          <h2 className="formTitle">
            <UserPlus size={22} style={{ marginRight: "8px" }} />
            Sign Up
          </h2>

          {message && <p className="message">{message}</p>}

          <div className="inputGroup">
            <input
              type="text"
              id="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputGroup">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputGroup">
            <input
              type="tel"
              id="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputGroup passwordGroup">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="togglePassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="inputGroup passwordGroup">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="togglePassword"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <input id="submit" type="submit" value="Register" />

          <div className="otherOptions">
            <Link to="/login" className="secondaryBtn">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;