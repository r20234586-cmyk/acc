export default function AuthLayout({ children, title, subtitle, onBack }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{
        position: "absolute", top: "-15%", right: "-10%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", left: "-10%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24, padding: "36px 32px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        animation: "slideUp 0.4s ease both",
      }}>
        {/* Back */}
        {onBack && (
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,0.07)", border: "none", color: "rgba(255,255,255,0.6)",
            width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 24,
          }}>←</button>
        )}

        {/* Logo mark */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #FF6B35, #FF6B35aa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>⚡</div>
          <span style={{
            fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.6)",
            fontFamily: "'Syne', sans-serif",
          }}>Activity Crew</span>
        </div>

        <h2 style={{
          fontSize: 26, fontWeight: 900, color: "#fff",
          fontFamily: "'Syne', sans-serif", margin: "0 0 6px", letterSpacing: -0.5,
        }}>{title}</h2>
        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.4)",
          fontFamily: "'DM Sans', sans-serif", margin: "0 0 28px", lineHeight: 1.5,
        }}>{subtitle}</p>

        {children}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
