import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { LogOut, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { courses as allCourses } from "../data/courses";
import "../App.css";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [progressByTitle, setProgressByTitle] = useState({});
  const [loading, setLoading] = useState(true);

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch per-user progress list
        const progressRes = await axios.get("http://localhost:5000/api/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const progressList = progressRes.data || [];
        const myCourses = progressList.map((p) => ({
          name: p.courseTitle,
          progress: Number(p.progressPct || 0),
        }));
        const byTitle = progressList.reduce((acc, p) => {
          acc[p.courseTitle] = Number(p.progressPct || 0);
          return acc;
        }, {});

        setCourses(myCourses);
        setProgressByTitle(byTitle);
        setData(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) return <div className="loading">Loading your dashboard...</div>;
  if (!data) return <div>Error loading data ❌</div>;

  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <div>
          <h1>👋 Welcome, {data.user.email.split("@")[0]}</h1>
          <p>Keep learning and track your progress below.</p>
        </div>
        <button className="logoutBtn" onClick={handleLogout}>
          <LogOut size={18} style={{ marginRight: "5px" }} /> Logout
        </button>
      </div>

      <div className="dashboardGrid">
        {/* 🧠 Courses Section */}
        <div className="dashboardCard">
          <h2>
            <BookOpen size={20} style={{ marginRight: "8px" }} />
            My Courses
          </h2>
          <ul className="courseList">
            {courses.map((course, i) => (
              <li key={i} className="courseItem">
                <div>
                  <strong>{course.name}</strong>
                  <div className="progressBar">
                    <div
                      className="progressFill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span>{course.progress}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 📊 Progress Chart */}
        <div className="dashboardCard chartCard">
          <h2>Overall Progress</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={courses.map((c) => ({
                  name: c.name,
                  value: c.progress,
                }))}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {courses.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboardGrid">
        <div className="dashboardCard" style={{ gridColumn: "1 / -1" }}>
          <h2>
            <BookOpen size={20} style={{ marginRight: "8px" }} /> All Courses
          </h2>
          <div className="dark-courses-grid" style={{ maxHeight: "unset" }}>
            {allCourses.map((course, idx) => {
              const pct = progressByTitle[course.title] ?? 0;
              const label = pct >= 100 ? 'Completed' : pct > 0 ? 'Continue' : 'Start';
              return (
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
                  <Link to={`/course?title=${encodeURIComponent(course.title)}`}>{label}</Link>
                </button>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
