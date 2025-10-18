import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", formData);

      console.log("Login successful:", res.data);


      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful ✅");

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      const errorObj = err.response?.data;
      let errorMessage = "Login failed ❌";

      if (errorObj) {
        if (typeof errorObj === "string") {
          errorMessage = errorObj;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }
      } else {
        errorMessage = err.message || "Network error occurred ❌";
      }

      setMessage(errorMessage);
    }
  };

  return (
    <div className="large">
      <div className="loginContainer dark">
        <div className="welcomeSection">
          <h1>Welcome Back, Chief 🧠</h1>
          <p>Log in and continue building something epic.</p>
        </div>

        <form className="loginForm" onSubmit={handleSubmit}>
          <h2 className="formTitle">
            <LogIn size={22} style={{ marginRight: "8px" }} />
            Log In
          </h2>

          {message && <p className="message">{message}</p>}

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

          <div className="inputGroup passwordGroup">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
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

          <input id="submit" type="submit" value="Log In" />

          <div className="otherOptions">
            <Link to="/register" className="secondaryBtn">
              Sign Up
            </Link>
            <button type="button" className="linkBtn">
              Forgot Password?
            </button>
          </div>
        </form>
      </div>

      <div className="showdata">
        <lottie-player
          src="https://assets10.lottiefiles.com/packages/lf20_jtbfg2nb.json"
          background="transparent"
          speed="1"
          style={{ width: "80%", height: "80%" }}
          loop
          autoplay
        ></lottie-player>
      </div>
    </div>
  );
};

export default LoginPage;
