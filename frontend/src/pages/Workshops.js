import React from "react";
import "../App.css";
import { Player } from "@lottiefiles/react-lottie-player";


const workshops = [
  {
    title: "React & Redux Crash Course",
    date: "Oct 20, 2025",
    description:
      "Learn React fundamentals and Redux state management to build scalable apps.",
  },
  {
    title: "Python for Cybersecurity",
    date: "Nov 5, 2025",
    description:
      "Hands-on Python exercises to secure systems and automate pentesting tasks.",
  },
  {
    title: "UI/UX Design Essentials",
    date: "Nov 15, 2025",
    description:
      "Learn how to create interactive, user-friendly web designs using Figma & Photoshop.",
  },
];

const Workshop = () => {
  return (
    <div className="large">
      <div className="loginContainer dark" style={{ width: "650px" }}>
        <div className="welcomeSection">
          <h1>Upcoming Workshops 🚀</h1>
          <p>Enhance your skills with interactive learning sessions.</p>
        </div>

        <div className="workshopCards">
          {workshops.map((workshop, index) => (
            <div className="workshopCard" key={index}>
              <h3>{workshop.title}</h3>
              <span>{workshop.date}</span>
              <p>{workshop.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="showdata">
        <Player
        autoplay
        loop
        src="https://assets3.lottiefiles.com/packages/lf20_wr6yLa2L3D.json"
        style={{ width: "80%", height: "80%" }}
      />
      </div>
    </div>
  );
};

export default Workshop;
