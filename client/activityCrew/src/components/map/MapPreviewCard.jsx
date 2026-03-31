export default function MapPreviewCard({ activity, onClose }) {
  if (!activity) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 12,
        right: 12,
        background: "rgba(18,18,24,0.97)",
        borderRadius: 18,
        padding: "16px",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        zIndex: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <span
            style={{
              fontSize: 10,
              color: activity.color,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {activity.category}
          </span>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              margin: "3px 0 4px",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {activity.title}
          </h3>
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {activity.distance} · {activity.joined}/{activity.max} joined
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
