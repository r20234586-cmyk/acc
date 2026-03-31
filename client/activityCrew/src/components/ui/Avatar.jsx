import { AVATAR_COLORS } from "../../data/constants";

export default function Avatar({ initials, size = 36, color = "#FF6B35", style = {} }) {
  const bg = AVATAR_COLORS[initials] || color;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${bg}dd, ${bg}88)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.33,
        fontWeight: 700,
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        flexShrink: 0,
        border: "1.5px solid rgba(255,255,255,0.15)",
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
