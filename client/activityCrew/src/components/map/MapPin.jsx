import { CATEGORIES } from "../../data/constants";

export default function MapPin({ activity, isSelected, onClick }) {
  const category = CATEGORIES.find((c) => c.id === activity.category);

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${activity.x}%`,
        top: `${activity.y}%`,
        transform: "translate(-50%, -50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: activity.color,
          color: "#fff",
          borderRadius: 50,
          padding: "5px 10px",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: `0 4px 16px ${activity.color}66`,
          whiteSpace: "nowrap",
          border: isSelected ? "2px solid #fff" : "2px solid transparent",
          transition: "all 0.2s",
        }}
      >
        {category?.emoji} {activity.title.split(" ").slice(0, 2).join(" ")}
      </div>
    </button>
  );
}
