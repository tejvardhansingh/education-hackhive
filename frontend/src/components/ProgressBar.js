import React from "react";

const ProgressBar = ({ value = 0, max = 100, label, height = 10 }) => {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div style={{ minWidth: 120 }}>
      {label ? (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 14, opacity: 0.85 }}>{label}</span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>{pct}%</span>
        </div>
      ) : null}
      <div
        className="progressBar"
        style={{
          width: "100%",
          height,
          background: "#1f2937",
          borderRadius: 999,
          overflow: "hidden",
          border: "1px solid #374151",
        }}
      >
        <div
          className="progressFill"
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg,#22c55e,#16a34a)",
            transition: "width 200ms ease",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
