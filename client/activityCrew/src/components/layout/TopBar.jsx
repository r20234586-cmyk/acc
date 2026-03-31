export default function TopBar({ title, onBack }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 18px",
      background: "rgba(13,13,18,0.98)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      flexShrink: 0,
    }}>
      <button onClick={onBack} style={{
        background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
        width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
        fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>←</button>
      <span style={{
        fontSize: 16, fontWeight: 700, color: "#fff",
        fontFamily: "'Syne', sans-serif",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{title}</span>
    </div>
  );
}
