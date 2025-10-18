import React, { useRef, useEffect, useState } from "react";
import "../App.css";

/* Replace these with your actual image paths */
import htmlImg from "../assets/htmlimg.png";
import cssImg from "../assets/cssimg.png";
import jsImg from "../assets/jsimg.png";
import pythonImg from "../assets/pythonimg.png";
import reactImg from "../assets/reactimg.png";
import nodeImg from "../assets/nodeimg.png";
import mongoImg from "../assets/mongoimg.png";
import postmanImg from "../assets/postmanimg.png";
import gitImg from "../assets/githubimg.png";

const languages = [
  { src: htmlImg, alt: "HTML5" },
  { src: cssImg, alt: "CSS3" },
  { src: jsImg, alt: "JavaScript" },
  { src: pythonImg, alt: "Python" },
  { src: reactImg, alt: "React" },
  { src: nodeImg, alt: "Node.js" },
  { src: mongoImg, alt: "MongoDB" },
  { src: postmanImg, alt: "Postman" },
  { src: gitImg, alt: "GitHub" },
];

const Language = ({ baseSpeed = 0.8, gap = 32 }) => {
  const stripRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [velocity, setVelocity] = useState(baseSpeed);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    let curX = 0;
    let rafId;

    const animate = () => {
      // Smoothly ease the animation speed when hovered
      const currentSpeed = isPaused
        ? Math.max(velocity * 0.9, 0.05) // slow down smoothly
        : Math.min(velocity + 0.03, baseSpeed); // speed back up
      setVelocity(currentSpeed);

      curX -= currentSpeed;
      const totalWidth = strip.scrollWidth;
      const half = totalWidth / 2;

      if (Math.abs(curX) >= half) {
        curX += half;
      }

      strip.style.transform = `translateX(${curX}px)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, baseSpeed, velocity]);

  // Renders icons twice for seamless looping
  const renderStrip = () => {
    const items = languages.map((l, i) => (
      <div className="lang-item" key={`lang-${i}`}>
        <img src={l.src} alt={l.alt} />
        <span className="lang-label">{l.alt}</span>
      </div>
    ));
    return (
      <>
        <div className="lang-strip-copy">{items}</div>
        <div className="lang-strip-copy">{items}</div>
      </>
    );
  };

  return (
    <section
      className="languages-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Programming languages marquee"
    >
      <div className="languages-inner">
        <div
          className="languages-strip"
          ref={stripRef}
          style={{ gap: `${gap}px` }}
        >
          {renderStrip()}
        </div>
      </div>
    </section>
  );
};

export default Language;
