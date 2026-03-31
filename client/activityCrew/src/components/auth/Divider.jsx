export default function Divider({ label = "or" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      margin: "20px 0",
    }}>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{
        fontSize: 11, color: "rgba(255,255,255,0.25)",
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: 1,
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}
