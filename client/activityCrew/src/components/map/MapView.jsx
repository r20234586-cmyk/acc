import { useState } from "react";
import { CATEGORIES } from "../../data/constants";

function MapPin({ activity, isSelected, onClick }) {
  const category = CATEGORIES.find((c) => c.id === activity.category);
  return (
    <button onClick={onClick} style={{
      position: "absolute",
      left: `${activity.x}%`, top: `${activity.y}%`,
      transform: "translate(-50%, -100%)",
      background: "none", border: "none", cursor: "pointer", zIndex: isSelected ? 20 : 10,
      padding: 0,
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          background: isSelected ? "#fff" : activity.color,
          color: isSelected ? activity.color : "#fff",
          borderRadius: isSelected ? "16px 16px 16px 4px" : "50%",
          width: isSelected ? "auto" : 34,
          height: isSelected ? "auto" : 34,
          padding: isSelected ? "6px 11px" : 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isSelected ? 11 : 15,
          fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
          boxShadow: `0 4px 14px ${activity.color}99`,
          whiteSpace: "nowrap",
          border: `2px solid ${isSelected ? activity.color : "rgba(255,255,255,0.25)"}`,
          transition: "all 0.2s",
          gap: isSelected ? 5 : 0,
        }}>
          <span>{category?.emoji}</span>
          {isSelected && <span>{activity.title.split(" ").slice(0, 2).join(" ")}</span>}
        </div>
        <div style={{
          width: 0, height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `7px solid ${isSelected ? "#fff" : activity.color}`,
          marginTop: -1,
        }} />
        <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.5)", marginTop: 1 }} />
      </div>
    </button>
  );
}

function MapPreviewCard({ activity, onClose }) {
  if (!activity) return null;
  const category = CATEGORIES.find(c => c.id === activity.category);
  return (
    <div style={{
      position: "absolute", bottom: 20, left: 16, right: 16,
      background: "rgba(13,13,18,0.97)",
      borderRadius: 20, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
      zIndex: 30, backdropFilter: "blur(20px)",
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${activity.color}, ${activity.color}44)` }} />
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
                color: activity.color, background: `${activity.color}18`,
                padding: "2px 8px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif",
              }}>{category?.emoji} {activity.category}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>· {activity.distance}</span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 5px", fontFamily: "'Syne', sans-serif" }}>
              {activity.title}
            </h3>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>◷ {activity.time}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>◎ {activity.location}</span>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.5)",
            width: 26, height: 26, borderRadius: "50%", cursor: "pointer", fontSize: 11, flexShrink: 0,
          }}>✕</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
            {activity.joined}/{activity.max} joined
          </span>
          <button style={{
            padding: "7px 18px", borderRadius: 50, border: "none", cursor: "pointer",
            background: activity.joined >= activity.max ? "rgba(255,255,255,0.06)" : activity.color,
            color: activity.joined >= activity.max ? "rgba(255,255,255,0.3)" : "#fff",
            fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
          }}>
            {activity.joined >= activity.max ? "Full" : "Join →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SatelliteCanvas({ children }) {
  return (
    <div style={{
      flex: 1, position: "relative", overflow: "hidden",
      background: `
        radial-gradient(ellipse at 25% 35%, rgba(20,55,20,0.35) 0%, transparent 45%),
        radial-gradient(ellipse at 75% 60%, rgba(18,48,18,0.28) 0%, transparent 38%),
        radial-gradient(ellipse at 50% 15%, rgba(10,30,65,0.4) 0%, transparent 40%),
        radial-gradient(ellipse at 85% 85%, rgba(35,25,8,0.25) 0%, transparent 35%),
        radial-gradient(ellipse at 15% 75%, rgba(12,40,12,0.3) 0%, transparent 30%),
        #0b0f13
      `,
    }}>
      {/* Terrain patches */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* Vegetation */}
        <div style={{ position: "absolute", left: "8%", top: "18%", width: "20%", height: "15%", borderRadius: "45% 55% 50% 50%", background: "rgba(22,65,22,0.55)" }} />
        <div style={{ position: "absolute", left: "52%", top: "30%", width: "13%", height: "11%", borderRadius: "50%", background: "rgba(20,60,20,0.5)" }} />
        <div style={{ position: "absolute", left: "72%", top: "62%", width: "17%", height: "13%", borderRadius: "55% 45% 42% 58%", background: "rgba(25,65,25,0.45)" }} />
        <div style={{ position: "absolute", left: "26%", top: "68%", width: "15%", height: "11%", borderRadius: "48%", background: "rgba(22,60,22,0.45)" }} />
        <div style={{ position: "absolute", left: "3%", top: "42%", width: "8%", height: "18%", borderRadius: "35% 65%", background: "rgba(18,55,18,0.4)" }} />
        {/* Water */}
        <div style={{ position: "absolute", left: "62%", top: "8%", width: "22%", height: "18%", borderRadius: "40% 60% 55% 45%", background: "rgba(8,30,70,0.6)" }} />
        <div style={{ position: "absolute", left: "4%", top: "58%", width: "11%", height: "9%", borderRadius: "50%", background: "rgba(10,28,65,0.5)" }} />
        {/* Urban blocks */}
        <div style={{ position: "absolute", left: "33%", top: "28%", width: "18%", height: "18%", borderRadius: "3px", background: "rgba(22,22,32,0.7)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)" }} />
        <div style={{ position: "absolute", left: "14%", top: "38%", width: "16%", height: "13%", borderRadius: "3px", background: "rgba(20,20,30,0.65)" }} />
        <div style={{ position: "absolute", left: "60%", top: "45%", width: "14%", height: "16%", borderRadius: "3px", background: "rgba(20,20,30,0.6)" }} />
        <div style={{ position: "absolute", left: "80%", top: "25%", width: "12%", height: "20%", borderRadius: "3px", background: "rgba(18,18,28,0.55)" }} />
        {/* Dirt patches */}
        <div style={{ position: "absolute", left: "45%", top: "70%", width: "18%", height: "12%", borderRadius: "40%", background: "rgba(55,40,15,0.3)" }} />
      </div>

      {/* Road network SVG */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.45 }}>
        {/* Highways */}
        <line x1="0%" y1="47%" x2="100%" y2="47%" stroke="#5a5a70" strokeWidth="2.5" />
        <line x1="41%" y1="0%" x2="41%" y2="100%" stroke="#5a5a70" strokeWidth="2.5" />
        {/* Major roads */}
        <line x1="0%" y1="24%" x2="100%" y2="31%" stroke="#3e3e52" strokeWidth="1.5" />
        <line x1="0%" y1="71%" x2="100%" y2="64%" stroke="#3e3e52" strokeWidth="1.5" />
        <line x1="21%" y1="0%" x2="17%" y2="100%" stroke="#3e3e52" strokeWidth="1.5" />
        <line x1="67%" y1="0%" x2="71%" y2="100%" stroke="#3e3e52" strokeWidth="1.5" />
        {/* Minor streets */}
        <line x1="0%" y1="59%" x2="41%" y2="47%" stroke="#2c2c3c" strokeWidth="1" />
        <line x1="41%" y1="47%" x2="100%" y2="54%" stroke="#2c2c3c" strokeWidth="1" />
        <line x1="21%" y1="24%" x2="41%" y2="47%" stroke="#2c2c3c" strokeWidth="1" />
        <line x1="41%" y1="47%" x2="67%" y2="34%" stroke="#2c2c3c" strokeWidth="1" />
        <line x1="67%" y1="47%" x2="100%" y2="38%" stroke="#2c2c3c" strokeWidth="1" />
        <line x1="0%" y1="35%" x2="21%" y2="47%" stroke="#2c2c3c" strokeWidth="1" />
        {/* Roundabout */}
        <circle cx="41%" cy="47%" r="1.8%" fill="none" stroke="#5a5a70" strokeWidth="1.5" />
        {/* Pedestrian paths */}
        <line x1="8%" y1="18%" x2="21%" y2="24%" stroke="#252535" strokeWidth="0.8" strokeDasharray="3,3" />
        <line x1="52%" y1="30%" x2="41%" y2="47%" stroke="#252535" strokeWidth="0.8" strokeDasharray="3,3" />
      </svg>

      {/* Noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        opacity: 0.4,
      }} />

      {/* Grid micro */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {children}
    </div>
  );
}

export default function MapView({ activities }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const uniqueCategories = [...new Set(activities.map(a => a.category))];

  const pins = activities
    .filter(a => filter === "all" || a.category === filter)
    .map((a, i) => ({
      ...a,
      x: 8 + ((i * 137 + 11) % 82),
      y: 8 + ((i * 89 + 23) % 78),
    }));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0b0f13" }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(8,10,16,0.98)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, fontFamily: "'Syne', sans-serif" }}>
              Nearby Activities
            </h2>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
              📍 Hyderabad · {pins.length} visible
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "5px 10px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 6px #34D399", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.8 }}>SATELLITE</span>
          </div>
        </div>
        {/* Filters */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
          {["all", ...uniqueCategories].map(cat => {
            const catData = CATEGORIES.find(c => c.id === cat);
            const active = filter === cat;
            return (
              <button key={cat} onClick={() => { setFilter(cat); setSelected(null); }} style={{
                padding: "5px 12px", borderRadius: 50, border: "none", cursor: "pointer",
                flexShrink: 0, fontSize: 11, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                background: active ? (cat === "all" ? "#FF6B35" : catData?.color) : "rgba(255,255,255,0.07)",
                color: active ? "#fff" : "rgba(255,255,255,0.45)",
              }}>
                {cat === "all" ? "✦ All" : `${catData?.emoji} ${cat}`}
              </button>
            );
          })}
        </div>
      </div>

      <SatelliteCanvas>
        {/* You are here */}
        <div style={{ position: "absolute", left: "41%", top: "47%", transform: "translate(-50%, -50%)", zIndex: 25 }}>
          <div style={{
            width: 14, height: 14, borderRadius: "50%",
            background: "#60A5FA", border: "2.5px solid #fff",
            boxShadow: "0 0 0 5px rgba(96,165,250,0.22), 0 0 0 10px rgba(96,165,250,0.1)",
          }} />
        </div>

        {pins.map(pin => (
          <MapPin
            key={pin.id}
            activity={pin}
            isSelected={selected?.id === pin.id}
            onClick={() => setSelected(selected?.id === pin.id ? null : pin)}
          />
        ))}

        {/* Compass rose */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          width: 34, height: 34, borderRadius: "50%",
          background: "rgba(8,10,16,0.88)", border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, zIndex: 15,
        }}>🧭</div>

        {/* Scale bar */}
        <div style={{
          position: "absolute", bottom: selected ? 155 : 14, left: 14, zIndex: 15,
          display: "flex", alignItems: "center", gap: 5,
          transition: "bottom 0.3s ease",
        }}>
          <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>1 km</span>
        </div>

        <MapPreviewCard activity={selected} onClose={() => setSelected(null)} />
      </SatelliteCanvas>
    </div>
  );
}
