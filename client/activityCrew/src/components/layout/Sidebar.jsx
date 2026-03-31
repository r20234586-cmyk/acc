import Avatar from "../ui/Avatar";

const NAV_ITEMS = [
  { id: "home",    icon: "◈", label: "Home"     },
  { id: "feed",    icon: "⊞", label: "Discover" },
  { id: "map",     icon: "◎", label: "Map"       },
  { id: "profile", icon: "○", label: "Profile"   },
];

export default function Sidebar({ activeTab, onTabChange, onCreateClick, unreadCount = 0, requestCount = 0, onNotificationsClick, onRequestsClick }) {
  return (
    <div style={{
      width: 200, flexShrink: 0, height: "100vh",
      background: "#0a0a0f",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", padding: "24px 12px",
    }}>

      {/* Logo */}
      <div style={{ padding: "4px 12px 28px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.8, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>
          📍 Hyderabad
        </div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: -0.3 }}>
          Activity Crew
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => onTabChange(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, border: "none",
              cursor: "pointer", textAlign: "left", width: "100%",
              background: active ? "rgba(255,255,255,0.07)" : "transparent",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 15, color: active ? "#FF6B35" : "rgba(255,255,255,0.35)", transition: "color 0.15s" }}>
                {item.icon}
              </span>
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                {item.label}
              </span>
              {active && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#FF6B35", boxShadow: "0 0 6px #FF6B35" }} />}
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 12px" }} />

        {/* Notifications */}
        <button onClick={onNotificationsClick} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 10, border: "none",
          cursor: "pointer", textAlign: "left", width: "100%",
          background: "transparent", transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ fontSize: 15, color: "rgba(255,255,255,0.35)" }}>🔔</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", flex: 1 }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "#FF6B35", borderRadius: 20, padding: "2px 7px", fontFamily: "'DM Sans', sans-serif" }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Connection Requests */}
        <button onClick={onRequestsClick} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 10, border: "none",
          cursor: "pointer", textAlign: "left", width: "100%",
          background: "transparent", transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ fontSize: 15, color: "rgba(255,255,255,0.35)" }}>◎</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", flex: 1 }}>
            Requests
          </span>
          {requestCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "#60A5FA", borderRadius: 20, padding: "2px 7px", fontFamily: "'DM Sans', sans-serif" }}>
              {requestCount}
            </span>
          )}
        </button>
      </nav>

      {/* Create */}
      <button onClick={onCreateClick} style={{
        width: "100%", padding: "11px", borderRadius: 12, border: "none",
        background: "linear-gradient(135deg, #FF6B35, #e85a25)",
        color: "#fff", fontSize: 13, fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
        marginBottom: 16, boxShadow: "0 4px 16px rgba(255,107,53,0.25)",
        transition: "opacity 0.2s, transform 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1";   e.currentTarget.style.transform = "translateY(0)"; }}
      >
        + Create Activity
      </button>

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
        <Avatar initials="ME" size={32} color="#60A5FA" />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Alex Johnson</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>⭐ 4.9</div>
        </div>
      </div>

    </div>
  );
}
