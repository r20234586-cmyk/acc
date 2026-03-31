const STATS = [
  { label: "Activities", value: 12 },
  { label: "Joined", value: 47 },
  { label: "Rating", value: "4.9" },
];

export default function ProfileStats() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {STATS.map((s) => (
        <div key={s.label} style={{ padding: "16px", textAlign: "center" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
