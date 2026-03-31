export default function ActivityInfoGrid({ activity, count }) {
  const items = [
    { icon: "◷", label: "When", value: activity.time },
    { icon: "◎", label: "Where", value: activity.location },
    { icon: "◉", label: "Distance", value: activity.distance },
    { icon: "◈", label: "Spots", value: `${count}/${activity.max} joined` },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: 20,
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 14,
            padding: "12px 14px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ fontSize: 16, color: activity.color, marginBottom: 4 }}>
            {item.icon}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
