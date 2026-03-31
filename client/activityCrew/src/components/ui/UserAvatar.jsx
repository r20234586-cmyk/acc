import { useRef } from "react";
import { AVATAR_COLORS } from "../../data/constants";

export default function UserAvatar({
  initials,
  avatarUrl = null,
  size = 36,
  color = "#FF6B35",
  editable = false,
  onUpload = null,
  style = {},
}) {
  const inputRef = useRef(null);
  const bg = AVATAR_COLORS[initials] || color;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={() => editable && inputRef.current?.click()}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        cursor: editable ? "pointer" : "default",
        border: "1.5px solid rgba(255,255,255,0.15)",
        ...style,
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          background: `linear-gradient(135deg, ${bg}dd, ${bg}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.33, fontWeight: 700, color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {initials}
        </div>
      )}

      {/* Edit overlay */}
      {editable && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 0, transition: "opacity 0.2s",
          fontSize: size * 0.28, color: "#fff",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
          onMouseLeave={e => e.currentTarget.style.opacity = "0"}
        >
          📷
        </div>
      )}

      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
}
