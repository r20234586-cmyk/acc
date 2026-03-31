const ERROR_PAGES = {
  404: {
    code: "404",
    icon: "◎",
    title: "Page not found",
    message: "The page you're looking for doesn't exist or has been moved.",
    color: "#60A5FA",
    action: "Go Home",
  },
  500: {
    code: "500",
    icon: "⚙",
    title: "Server error",
    message: "Something went wrong on our end. We're working on it. Please try again in a moment.",
    color: "#FC8181",
    action: "Try Again",
  },
  offline: {
    code: "—",
    icon: "◌",
    title: "No connection",
    message: "You appear to be offline. Check your internet connection and try again.",
    color: "#FBBF24",
    action: "Retry",
  },
  session: {
    code: "401",
    icon: "🔒",
    title: "Session expired",
    message: "Your session has timed out. Please sign in again to continue.",
    color: "#A78BFA",
    action: "Sign In Again",
  },
  forbidden: {
    code: "403",
    icon: "⊘",
    title: "Access denied",
    message: "You don't have permission to view this page.",
    color: "#F472B6",
    action: "Go Back",
  },
};

export default function ErrorPage({ type = "404", onAction }) {
  const config = ERROR_PAGES[type] || ERROR_PAGES["404"];

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px", textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${config.color}0f 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Big code */}
      <div style={{
        fontSize: 96, fontWeight: 900, color: "rgba(255,255,255,0.04)",
        fontFamily: "'Syne', sans-serif", lineHeight: 1,
        position: "absolute", userSelect: "none",
        letterSpacing: -4,
      }}>{config.code}</div>

      {/* Icon */}
      <div style={{
        width: 72, height: 72, borderRadius: 24, marginBottom: 24,
        background: `${config.color}15`,
        border: `1px solid ${config.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, position: "relative",
        boxShadow: `0 8px 32px ${config.color}20`,
      }}>{config.icon}</div>

      <div style={{
        fontSize: 11, fontWeight: 700, color: config.color,
        fontFamily: "'DM Sans', sans-serif", letterSpacing: 2,
        textTransform: "uppercase", marginBottom: 10,
      }}>Error {config.code}</div>

      <h1 style={{
        fontSize: 28, fontWeight: 900, color: "#fff",
        fontFamily: "'Syne', sans-serif", margin: "0 0 12px",
        letterSpacing: -0.5,
      }}>{config.title}</h1>

      <p style={{
        fontSize: 14, color: "rgba(255,255,255,0.4)",
        fontFamily: "'DM Sans', sans-serif", maxWidth: 340,
        lineHeight: 1.7, margin: "0 0 32px",
      }}>{config.message}</p>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => window.history.back()} style={{
          padding: "12px 24px", borderRadius: 50,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
        }}>← Go Back</button>

        <button onClick={onAction} style={{
          padding: "12px 24px", borderRadius: 50, border: "none",
          background: `linear-gradient(135deg, ${config.color}, ${config.color}aa)`,
          color: "#fff", fontSize: 13, fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          boxShadow: `0 4px 16px ${config.color}30`,
        }}>{config.action}</button>
      </div>

      {/* Decorative dots */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 6,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: i === 1 ? config.color : "rgba(255,255,255,0.1)",
          }} />
        ))}
      </div>
    </div>
  );
}

export { ERROR_PAGES };
