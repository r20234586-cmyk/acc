import { useState } from "react";
import { CATEGORIES, MOCK_ACTIVITIES } from "../../data/constants";
import UserAvatar from "../ui/UserAvatar";
import ProgressBar from "../ui/ProgressBar";

const ALL_UPCOMING = [
  { id: 1, day: "MON", date: "10", title: "Badminton Doubles", time: "6:00 AM", color: "#FF6B35", category: "sports", location: "YMCA Court 3" },
  { id: 2, day: "WED", date: "12", title: "Startup Meetup", time: "6:00 PM", color: "#FBBF24", category: "social", location: "T-Hub, IIIT" },
  { id: 3, day: "FRI", date: "14", title: "Board Game Night", time: "7:00 PM", color: "#60A5FA", category: "gaming", location: "Dice & Brew Café" },
  { id: 4, day: "SUN", date: "16", title: "Morning Run 5K", time: "6:30 AM", color: "#F472B6", category: "fitness", location: "KBR Park" },
  { id: 5, day: "MON", date: "17", title: "Guitar Jam Session", time: "5:00 PM", color: "#A78BFA", category: "music", location: "Studio 7" },
  { id: 6, day: "TUE", date: "18", title: "GATE Study Group", time: "10:00 AM", color: "#34D399", category: "study", location: "Starbucks, Jubilee Hills" },
];

const ALL_PEOPLE = [
  { initials: "AK", name: "Arjun K.", interests: ["Badminton", "Fitness"], mutual: 3, distance: "1.2 km", rating: 4.8 },
  { initials: "MD", name: "Meera D.", interests: ["Music", "Social"], mutual: 5, distance: "2.8 km", rating: 4.9 },
  { initials: "RT", name: "Ravi T.", interests: ["Running", "Fitness"], mutual: 2, distance: "0.9 km", rating: 4.7 },
  { initials: "PS", name: "Priya S.", interests: ["Study", "Social"], mutual: 4, distance: "3.1 km", rating: 5.0 },
  { initials: "KM", name: "Kiran M.", interests: ["Startup", "Social"], mutual: 6, distance: "4.5 km", rating: 4.6 },
  { initials: "SP", name: "Sai P.", interests: ["Football", "Sports"], mutual: 1, distance: "6.8 km", rating: 4.8 },
  { initials: "LV", name: "Laura V.", interests: ["Languages", "Social"], mutual: 3, distance: "3.1 km", rating: 4.9 },
  { initials: "AR", name: "Ananya R.", interests: ["Gaming", "Social"], mutual: 2, distance: "4.5 km", rating: 4.7 },
];

const ALL_TRENDING = MOCK_ACTIVITIES.map((a, i) => ({
  ...a,
  trend: ["+31%", "+24%", "+18%", "+15%", "+12%", "+9%", "+8%", "+5%"][i] || "+3%",
}));

// ── Trending expanded ─────────────────────────────────────────────

function TrendingFull({ activities }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {activities.map((a, idx) => {
        const category = CATEGORIES.find(c => c.id === a.category);
        return (
          <div key={a.id} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, cursor: "pointer",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
          >
            <div style={{
              width: 28, fontWeight: 900, fontSize: 14,
              color: idx < 3 ? "#FF6B35" : "rgba(255,255,255,0.2)",
              fontFamily: "'Syne', sans-serif", flexShrink: 0, textAlign: "center",
            }}>#{idx + 1}</div>

            <div style={{
              width: 44, height: 44, borderRadius: 13, flexShrink: 0,
              background: `${a.color}22`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>{category?.emoji}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
                {a.title}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
                {a.location} · {a.distance}
              </div>
              <ProgressBar value={a.joined} max={a.max} color={a.color} />
            </div>

            <div style={{
              fontSize: 12, fontWeight: 700, color: "#34D399",
              fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
              background: "rgba(52,211,153,0.1)", padding: "4px 10px", borderRadius: 20,
            }}>↑ {a.trend}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Upcoming expanded ─────────────────────────────────────────────

function UpcomingFull({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(item => {
        const category = CATEGORIES.find(c => c.id === item.category);
        return (
          <div key={item.id} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "14px 16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderLeft: `3px solid ${item.color}`,
            borderRadius: 16,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: `${item.color}18`,
              border: `1px solid ${item.color}33`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: item.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5 }}>
                {item.day}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                {item.date}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginTop: 3 }}>
                {category?.emoji} {item.time} · {item.location}
              </div>
            </div>

            <div style={{
              width: 9, height: 9, borderRadius: "50%",
              background: item.color, flexShrink: 0,
              boxShadow: `0 0 8px ${item.color}`,
            }} />
          </div>
        );
      })}
    </div>
  );
}

// ── People expanded ───────────────────────────────────────────────

function PeopleFull({ people, onConnect }) {
  const [connected, setConnected] = useState({});
  const toggle = (initials) => {
    setConnected(c => ({ ...c, [initials]: !c[initials] }));
    onConnect && onConnect(initials);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {people.map(p => (
        <div key={p.initials} style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 18, padding: "18px",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 10, textAlign: "center",
        }}>
          <UserAvatar initials={p.initials} size={56} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>
              {p.name}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
              {p.distance} · ★ {p.rating}
            </div>
          </div>

          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center" }}>
            {p.interests.map(tag => (
              <span key={tag} style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 20,
                background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)",
                fontFamily: "'DM Sans', sans-serif",
              }}>{tag}</span>
            ))}
          </div>

          <div style={{ fontSize: 11, color: "#60A5FA", fontFamily: "'DM Sans', sans-serif" }}>
            {p.mutual} mutual activities
          </div>

          <button onClick={() => toggle(p.initials)} style={{
            width: "100%", padding: "8px", borderRadius: 50, border: "none", cursor: "pointer",
            background: connected[p.initials] ? "rgba(255,255,255,0.07)" : "rgba(96,165,250,0.15)",
            color: connected[p.initials] ? "rgba(255,255,255,0.4)" : "#60A5FA",
            fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}>
            {connected[p.initials] ? "Connected ✓" : "+ Connect"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────

export default function ExpandedPanel({ section, onBack }) {
  const titles = {
    trending: "Trending Near You",
    upcoming: "All Upcoming",
    people: "People Nearby",
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0f0f16" }}>
      {/* Header */}
      <div style={{
        padding: "22px 24px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.07)", border: "none", color: "#fff",
          width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
          fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center",
        }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", margin: 0 }}>
          {titles[section]}
        </h2>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 24px",
        scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent",
      }}>
        {section === "trending" && <TrendingFull activities={ALL_TRENDING} />}
        {section === "upcoming" && <UpcomingFull items={ALL_UPCOMING} />}
        {section === "people" && <PeopleFull people={ALL_PEOPLE} />}
      </div>
    </div>
  );
}
