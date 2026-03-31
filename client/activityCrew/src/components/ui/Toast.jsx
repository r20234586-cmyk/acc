export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(30,30,40,0.98)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: 50,
        fontSize: 13,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.12)",
        zIndex: 999,
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      {message}
    </div>
  );
}
