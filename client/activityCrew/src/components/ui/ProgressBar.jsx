export default function ProgressBar({ value, max, color, showLabels = false }) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div>
      {showLabels && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
            {value} joined
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
            {max - value} spots left
          </span>
        </div>
      )}
      <div
        style={{
          height: showLabels ? 4 : 3,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}77)`,
            borderRadius: 10,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
