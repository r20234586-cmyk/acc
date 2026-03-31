export default function CategoryPill({ category, color, emoji, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 50,
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        background: active
          ? category === "all"
            ? "#fff"
            : color
          : "rgba(255,255,255,0.07)",
        color: active
          ? category === "all"
            ? "#0d0d12"
            : "#fff"
          : "rgba(255,255,255,0.5)",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.2s",
      }}
    >
      {emoji} {category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  );
}
