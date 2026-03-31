import { CATEGORIES } from "../../data/constants";
import Avatar from "../ui/Avatar";
import ProgressBar from "../ui/ProgressBar";

function EmptyState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "60%", gap: 16, padding: 40, textAlign: "center",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "rgba(255,107,53,0.1)",
        border: "1px solid rgba(255,107,53,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
      }}>⚡</div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", margin: 0 }}>
        No activities yet
      </h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, maxWidth: 240, margin: 0 }}>
        Join activities from the feed and they'll show up here.
      </p>
    </div>
  );
}

function ActivityRow({ activity, onOpen }) {
  const category = CATEGORIES.find(c => c.id === activity.category);
  const isUpcoming = true; // In real app, compare activity.time to now

  return (
    <div
      onClick={() => onOpen(activity)}
      style={{
        background: "rgba(18,18,24,0.95)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18, overflow: "hidden", cursor: "pointer",
        marginBottom: 12, transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Color accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${activity.color}, ${activity.color}33)` }} />

      <div style={{ padding: "14px 16px" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            {/* Badge row */}
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                color: activity.color, background: `${activity.color}18`,
                padding: "2px 8px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif",
              }}>
                {category?.emoji} {activity.category}
              </span>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 20,
                background: isUpcoming ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
                color: isUpcoming ? "#34D399" : "rgba(255,255,255,0.3)",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              }}>
                {isUpcoming ? "● Upcoming" : "✓ Completed"}
              </span>
            </div>
            <h3 style={{
              fontSize: 15, fontWeight: 700, color: "#fff",
              fontFamily: "'Syne', sans-serif", margin: 0, lineHeight: 1.2,
            }}>{activity.title}</h3>
          </div>

          {/* Host badge */}
          {activity.hostAvatar === "ME" && (
            <span style={{
              fontSize: 10, padding: "4px 10px", borderRadius: 20,
              background: "rgba(255,107,53,0.15)", color: "#FF6B35",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              border: "1px solid rgba(255,107,53,0.25)", flexShrink: 0, marginLeft: 10,
            }}>Host</span>
          )}
        </div>

        {/* Meta */}
        <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: activity.color }}>◷</span> {activity.time}
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: activity.color }}>◎</span> {activity.location}
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
            📍 {activity.distance}
          </span>
        </div>

        {/* Participants + progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Overlapping avatars */}
          <div style={{ display: "flex", marginLeft: -2 }}>
            {activity.attendees.slice(0, 4).map((a, i) => (
              <div key={i} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i }}>
                <Avatar initials={a} size={26} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
                {activity.joined}/{activity.max} joined
              </span>
            </div>
            <ProgressBar value={activity.joined} max={activity.max} color={activity.color} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyActivitiesView({ activities, onOpen }) {
  const hosted = activities.filter(a => a.hostAvatar === "ME");
  const joined = activities.filter(a => a.hostAvatar !== "ME");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0d0d12" }}>
      {/* Header */}
      <div style={{
        padding: "20px 20px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(13,13,18,0.98)",
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", margin: 0 }}>
          My Activities
        </h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginTop: 3 }}>
          {activities.length} total · {hosted.length} hosted · {joined.length} joined
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
        {activities.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20,
            }}>
              {[
                { label: "Total", value: activities.length, color: "#FF6B35" },
                { label: "Hosted", value: hosted.length, color: "#A78BFA" },
                { label: "Joined", value: joined.length, color: "#34D399" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14, padding: "14px 12px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "'Syne', sans-serif" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Hosted section */}
            {hosted.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.2, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
                  Hosting
                </div>
                {hosted.map(a => <ActivityRow key={a.id} activity={a} onOpen={onOpen} />)}
              </div>
            )}

            {/* Joined section */}
            {joined.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.2, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>
                  Joined
                </div>
                {joined.map(a => <ActivityRow key={a.id} activity={a} onOpen={onOpen} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
