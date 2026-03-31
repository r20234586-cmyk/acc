import { useState } from "react";
import { CATEGORIES, MOCK_ACTIVITIES } from "../../data/constants";
import UserAvatar from "../ui/UserAvatar";

const SUGGESTED_PEOPLE = [
  { initials: "AK", name: "Arjun K.", interests: ["Badminton", "Fitness"], mutual: 3, distance: "1.2 km" },
  { initials: "MD", name: "Meera D.", interests: ["Music", "Social"], mutual: 5, distance: "2.8 km" },
  { initials: "RT", name: "Ravi T.", interests: ["Running", "Fitness"], mutual: 2, distance: "0.9 km" },
];

const UPCOMING = [
  { id: 1, day: "MON", date: "10", title: "Badminton Doubles", time: "6:00 AM", color: "#FF6B35", category: "sports" },
  { id: 2, day: "WED", date: "12", title: "Startup Meetup", time: "6:00 PM", color: "#FBBF24", category: "social" },
  { id: 3, day: "FRI", date: "14", title: "Board Game Night", time: "7:00 PM", color: "#60A5FA", category: "gaming" },
];

const USER_STATS = [
  { label: "This week", value: 3, unit: "activities", icon: "⚡", color: "#FF6B35" },
  { label: "Streak", value: 12, unit: "days", icon: "🔥", color: "#FBBF24" },
  { label: "Met", value: 28, unit: "people", icon: "◎", color: "#34D399" },
  { label: "Rating", value: "4.9", unit: "avg", icon: "★", color: "#A78BFA" },
];

const TRENDING = MOCK_ACTIVITIES.slice(0, 3).map((a, i) => ({
  ...a, trend: ["+31%", "+12%", "+8%"][i],
}));

function SectionTitle({ children, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h3 style={{
        fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase", letterSpacing: 1.2,
        fontFamily: "'DM Sans', sans-serif", margin: 0,
      }}>{children}</h3>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", color: "#FF6B35",
          fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
        }}>{action} →</button>
      )}
    </div>
  );
}

export default function RightPanel({ onCreateClick, onExpand, onShowRequests, requestCount = 0, profile }) {
  const [connected, setConnected] = useState({});

  return (
    <div style={{
      height: "100%", overflowY: "auto", background: "#0f0f16",
      scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 20px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <UserAvatar initials={profile?.initials || "ME"} avatarUrl={profile?.avatarUrl} size={36} color="#60A5FA" />
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>
              Good morning ☀️
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif" }}>
              {profile?.name || "Alex Johnson"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Connection requests bell */}
          <button onClick={onShowRequests} title="Connection Requests" style={{
            position: "relative", background: "rgba(255,255,255,0.07)", border: "none",
            width: 36, height: 36, borderRadius: "50%", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#fff", transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
          >
            🔗
            {requestCount > 0 && (
              <div style={{
                position: "absolute", top: -2, right: -2,
                width: 16, height: 16, borderRadius: "50%",
                background: "#FF6B35", border: "2px solid #0f0f16",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans', sans-serif",
              }}>{requestCount}</div>
            )}
          </button>

          <button onClick={onCreateClick} style={{
            padding: "8px 16px", borderRadius: 50, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #FF6B35, #FF6B35bb)",
            color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
          }}>+ Create</button>
        </div>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* Stats */}
        <section>
          <SectionTitle>Your Activity</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {USER_STATS.map(stat => (
              <div key={stat.label} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 6,
              }}>
                <div style={{ fontSize: 16 }}>{stat.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{stat.value}</div>
                <div>
                  <div style={{ fontSize: 10, color: stat.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{stat.unit}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming */}
        <section>
          <SectionTitle action="View all" onAction={() => onExpand("upcoming")}>Upcoming</SectionTitle>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "4px 14px" }}>
            {UPCOMING.map((item, idx) => {
              const category = CATEGORIES.find(c => c.id === item.category);
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                  borderBottom: idx < UPCOMING.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: `${item.color}18`, border: `1px solid ${item.color}33`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: item.color, fontFamily: "'DM Sans', sans-serif" }}>{item.day}</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{item.date}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{item.title}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>{category?.emoji} {item.time}</div>
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.color, boxShadow: `0 0 5px ${item.color}` }} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Trending */}
        <section>
          <SectionTitle action="See all" onAction={() => onExpand("trending")}>Trending Near You</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {TRENDING.map(a => {
              const category = CATEGORIES.find(c => c.id === a.category);
              return (
                <div key={a.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, cursor: "pointer", transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: `${a.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{category?.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>{a.joined}/{a.max} joined</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#34D399", fontFamily: "'DM Sans', sans-serif", background: "rgba(52,211,153,0.1)", padding: "2px 7px", borderRadius: 20, flexShrink: 0 }}>↑ {a.trend}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* People Nearby */}
        <section>
          <SectionTitle action="Browse all" onAction={() => onExpand("people")}>People Nearby</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {SUGGESTED_PEOPLE.map(p => (
              <div key={p.initials} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12,
              }}>
                <UserAvatar initials={p.initials} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>{p.distance} · {p.mutual} mutual</div>
                </div>
                <button onClick={() => setConnected(c => ({ ...c, [p.initials]: !c[p.initials] }))} style={{
                  padding: "5px 12px", borderRadius: 50, border: "none", cursor: "pointer",
                  background: connected[p.initials] ? "rgba(255,255,255,0.07)" : "rgba(96,165,250,0.15)",
                  color: connected[p.initials] ? "rgba(255,255,255,0.4)" : "#60A5FA",
                  fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, transition: "all 0.2s",
                }}>
                  {connected[p.initials] ? "✓" : "+ Connect"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
