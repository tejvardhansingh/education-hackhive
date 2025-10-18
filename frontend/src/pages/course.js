import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { courses as allCourses } from "../data/courses";
import { courseLessons } from "../data/courseLessons";
import ProgressBar from "../components/ProgressBar";

// Helper to read query params
const useQuery = () => new URLSearchParams(useLocation().search);

const buildFallbackLessons = (courseTitle, tags = []) => {
  const base = [
    { id: 1, title: `${courseTitle}: Introduction`, videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U" },
    { id: 2, title: `${courseTitle}: Fundamentals`, videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U" },
    { id: 3, title: `${courseTitle}: Hands-on`, videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U" },
    { id: 4, title: `${courseTitle}: Best Practices`, videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U" },
    { id: 5, title: `${courseTitle}: Final Project`, videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U" },
  ];
  return base.map((l, i) => ({ ...l, id: i + 1 }));
};

const CoursePage = () => {
  const query = useQuery();
  const title = query.get("title");

  const course = useMemo(() => {
    if (!title) return null;
    return allCourses.find((c) => c.title === title) || null;
  }, [title]);

  const lessons = useMemo(() => {
    if (!course?.title) return buildFallbackLessons("Course");
    const fromMap = courseLessons[course.title];
    if (Array.isArray(fromMap) && fromMap.length > 0) return fromMap;
    if (course?.lessons && Array.isArray(course.lessons) && course.lessons.length > 0) return course.lessons;
    return buildFallbackLessons(course.title, course?.tags || []);
  }, [course]);

  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(lessons[0]);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const saveTimerRef = useRef(null);
  const lastPayloadRef = useRef(null);

  useEffect(() => {
    setActiveLesson(Array.isArray(lessons) ? lessons[0] : null);
  }, [lessons]);

  const totalLessons = Array.isArray(lessons) ? lessons.length : 0;
  const computePct = (completedCount, total) => (total > 0 ? Math.round((completedCount / total) * 100) : 0);

  const getUserEmail = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u?.email) return u.email;
    } catch (_) {}
    // Fallback: try to decode JWT payload
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(b64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      const payload = JSON.parse(json);
      return payload?.email || payload?.user?.email || null;
    } catch (_) {
      return null;
    }
  };

  const getUserId = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u?._id || u?.id) return String(u._id || u.id);
    } catch (_) {}
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(
        decodeURIComponent(
          atob(b64)
            .split("")
            .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join("")
        )
      );
      return (
        (payload && (payload.id || payload._id || payload.sub || payload.userId))
          ? String(payload.id || payload._id || payload.sub || payload.userId)
          : null
      );
    } catch (_) {
      return null;
    }
  };
  const getStorageKey = () => {
    const uid = getUserId();
    const email = getUserEmail();
    const userKey = uid || email;
    return userKey && course?.title ? `progress:${userKey}:${course.title}` : null;
  };

  const loadLocalCompleted = () => {
    const key = getStorageKey();
    if (!key) return [];
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  };

  const saveLocalCompleted = (arr) => {
    const key = getStorageKey();
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (_) {}
  };

  // Fetch or start progress on mount, and sync merged state
  useEffect(() => {
    const init = async () => {
      if (!course?.title) return;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/progress/${encodeURIComponent(course.title)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const serverCompleted = Array.isArray(res.data.completedLessonIds) ? res.data.completedLessonIds : [];
        const localCompleted = loadLocalCompleted();
        const merged = Array.from(new Set([...(serverCompleted || []), ...(localCompleted || [])]));
        setCompleted(merged);
        saveLocalCompleted(merged);
        // Ensure backend reflects merged state in case previous save attempts failed
        try {
          const tl = Array.isArray(lessons) ? lessons.length : 0;
          await axios.put(
            `http://localhost:5000/api/progress/${encodeURIComponent(course.title)}`,
            { progressPct: computePct(merged.length, tl), completedLessonIds: merged },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (e) {
          // keep UI/local even if sync fails
          console.warn("Initial sync failed; will rely on subsequent saves", e);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            await axios.post(
              "http://localhost:5000/api/progress/start",
              { courseTitle: course.title },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const localCompleted = loadLocalCompleted();
            setCompleted(localCompleted);
            // If there is existing local progress, push it to backend so it's persisted
            if (Array.isArray(localCompleted) && localCompleted.length > 0) {
              try {
                const tl = Array.isArray(lessons) ? lessons.length : 0;
                await axios.put(
                  `http://localhost:5000/api/progress/${encodeURIComponent(course.title)}`,
                  { progressPct: computePct(localCompleted.length, tl), completedLessonIds: localCompleted },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              } catch (e) {
                console.warn("Syncing local progress after start failed", e);
              }
            }
          } catch (e) {
            console.error("Failed to start course", e);
          }
        } else {
          console.error("Failed to fetch progress", err);
          // Fallback to local progress so the UI restores state even when offline or unauthorized
          const localCompleted = loadLocalCompleted();
          setCompleted(localCompleted);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [course?.title, lessons]);

  // cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const progressPct = computePct(completed.length, totalLessons);

  if (!course) {
    if (loading) return <div className="loading">Loading course...</div>;

  return (
      <div className="dashboardContainer">
        <div className="dashboardCard">
          <h2>Course not found</h2>
          <p>The selected course could not be located.</p>
          <Link className="dark-get-course-btn" to="/dashboard">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const toggleComplete = async (id) => {
    const token = localStorage.getItem("token");
    let newCompleted;
    setCompleted((prev) => {
      newCompleted = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      return newCompleted;
    });

    saveLocalCompleted(newCompleted);

    // Debounced, retried save
    const payload = {
      progressPct: computePct((newCompleted || []).length, totalLessons),
      completedLessonIds: newCompleted || [],
    };
    lastPayloadRef.current = payload;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaveState("saving");
      const maxRetries = 3;
      let attempt = 0;
      while (attempt < maxRetries) {
        try {
          await axios.put(
            `http://localhost:5000/api/progress/${encodeURIComponent(course.title)}`,
            lastPayloadRef.current,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setSaveState("saved");
          return;
        } catch (e) {
          attempt += 1;
          if (attempt >= maxRetries) {
            console.error("Failed to update progress after retries", e);
            setSaveState("error");
            return;
          }
          // simple backoff
          await new Promise((res) => setTimeout(res, 400 * attempt));
        }
      }
    }, 400);
  };

  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
        <div style={{ textAlign: "right", width: 260 }}>
          <ProgressBar value={progressPct} max={100} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <small>{progressPct}% complete</small>
            {saveState === "saving" && <small style={{ opacity: 0.7 }}>Saving…</small>}
            {saveState === "saved" && <small style={{ color: "#16a34a" }}>Saved</small>}
            {saveState === "error" && <small style={{ color: "#ef4444" }}>Offline, will retry</small>}
          </div>
        </div>
      </div>

      <div className="dashboardGrid">
        {/* Video/Content Pane */}
        <div className="dashboardCard" style={{ gridColumn: "1 / span 2" }}>
          <h2>{activeLesson?.title}</h2>
          <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", marginTop: 12 }}>
            <iframe
              title={activeLesson?.title}
              src={activeLesson?.videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Lessons List */}
        <div className="dashboardCard">
          <h2>Lessons</h2>
          <ul className="courseList">
            {lessons.map((l) => (
              <li key={l.id} className="courseItem">
                <div style={{ cursor: "pointer" }} onClick={() => setActiveLesson(l)}>
                  <strong>{l.title}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={completed.includes(l.id)}
                    onChange={() => toggleComplete(l.id)}
                    aria-label={`Mark ${l.title} as completed`}
                  />
                  <span>{completed.includes(l.id) ? "Done" : "Pending"}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
