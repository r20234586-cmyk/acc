import { useState, useEffect } from "react";
import { CATEGORIES } from "../../data/constants";
import Avatar from "../ui/Avatar";
import api from "../../api/api";

function ActivityGrid({ items, label, color, onOpen }) {
  if (!items || !items.length) return (
    <div style={{
      textAlign: "center", padding: "40px 0",
      color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    }}>
      No {label.toLowerCase()} activities yet
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {items.map(a => {
        const cat = CATEGORIES.find(c => c.id === a.category);
        return (
          <div
            key={a.id}
            onClick={() => onOpen && onOpen(a)}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${a.color}28`,
              borderRadius: 16, padding: "16px",
              cursor: onOpen ? "pointer" : "default",
              transition: "background 0.15s, transform 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, marginBottom: 10,
              background: `${a.color}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>{cat?.emoji}</div>
            <div style={{
              fontSize: 12, fontWeight: 700, color: "#fff",
              fontFamily: "'DM Sans', sans-serif", marginBottom: 4, lineHeight: 1.35,
            }}>{a.title}</div>
            <div style={{
              fontSize: 10, color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Sans', sans-serif", marginBottom: 10,
            }}>{a.time}</div>
            <span style={{
              fontSize: 10, fontWeight: 700, color,
              background: `${color}15`, padding: "3px 9px",
              borderRadius: 20, display: "inline-block",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {label === "Hosted" ? "🎯 Host" : "✓ Joined"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function UserProfilePage({ userId = 1, onBack, onOpen }) {
  const [activeTab, setActiveTab] = useState("hosted");
  const [connectionStatus, setConnectionStatus] = useState("none"); // none, pending, connected
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use the combined stats endpoint which returns user + stats
        const { data } = await api.get(`/api/auth/user/${userId}/stats`);
        const u = data.user;
        setUserData({
          name:              u.name,
          bio:               u.bio,
          location:          u.location,
          profilePicture:    u.profilePicture,
          interests:         u.interests || [],
          rating:            u.rating,
          media:             u.media || [],
          hostedActivities:  data.stats.hosted,
          joinedActivities:  data.stats.joined,
          connections:       0,
          hostedEvents:      [],
          joinedEvents:      [],
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d12",
        color: "rgba(255,255,255,0.4)",
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Loading user profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d12",
        color: "rgba(255,255,255,0.4)",
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        User not found
      </div>
    );
  }

  const user = userData;

  const handleConnect = async () => {
    if (connectionStatus === "none") {
      setConnectionStatus("pending");
      try {
        await api.post(`/api/connections/request/${userId}`);
      } catch (err) {
        console.warn('[Connect] request failed:', err.response?.data?.message || err.message);
        // If already sent, keep pending; otherwise revert
        if (!err.response?.data?.message?.includes('already')) {
          setConnectionStatus("none");
        }
      }
    }
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#0d0d12" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, rgba(96,165,250,0.15) 0%, #0d0d12 65%)",
        padding: "28px 24px 20px",
      }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                style={{
                  width: 68, height: 68, borderRadius: 12,
                  objectFit: "cover"
                }}
              />
            ) : (
              <Avatar initials={user?.name?.split(' ').map((n) => n[0]).join('') || "U"} size={68} color="#FF6B35" />
            )}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 3px", fontFamily: "'Syne', sans-serif" }}>
                {user?.name}
              </h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                📍 {user?.location}
              </p>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 50,
              border: connectionStatus === "connected" ? "1px solid rgba(52,211,153,0.3)" :
                      connectionStatus === "pending" ? "1px solid rgba(255,255,255,0.1)" : `1px solid #FF6B3540`,
              background: connectionStatus === "connected" ? "rgba(52,211,153,0.15)" :
                          connectionStatus === "pending" ? "rgba(255,255,255,0.07)" : `#FF6B3520`,
              color: connectionStatus === "connected" ? "#34D399" :
                     connectionStatus === "pending" ? "rgba(255,255,255,0.4)" : "#FF6B35",
              fontSize: 12,
              fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              if (connectionStatus === "connected") {
                e.currentTarget.style.background = "rgba(52,211,153,0.2)";
              }
            }}
            onMouseLeave={e => {
              if (connectionStatus === "connected") {
                e.currentTarget.style.background = "rgba(52,211,153,0.15)";
              }
            }}
          >
            {connectionStatus === "connected" ? "✓ Connected" : connectionStatus === "pending" ? "Requested" : "+ Connect"}
          </button>
        </div>

        {/* Bio */}
        {user?.bio && (
          <p style={{
            fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.5, margin: "0 0 12px"
          }}>
            {user.bio}
          </p>
        )}

        {/* Interest tags */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {user?.interests?.map(tag => (
            <span key={tag} style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 20,
              background: "#FF6B3518", color: "#FF6B35",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        {user && [
          { label: "Hosted", value: user.hostedActivities, color: "#FF6B35" },
          { label: "Joined", value: user.joinedActivities, color: "#60A5FA" },
          { label: "Connections", value: user.connections, color: "#34D399" },
          { label: "Rating", value: user.rating.toFixed(1), color: "#A78BFA" },
        ].map(s => (
          <div key={s.label} style={{ padding: "16px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: s.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab switcher + grids */}
      <div style={{ padding: "20px 24px 32px" }}>
        {/* Pill tabs */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {user && [
            { id: "hosted", label: "Hosted", count: user.hostedActivities, color: "#FF6B35" },
            { id: "joined", label: "Joined", count: user.joinedActivities, color: "#60A5FA" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex: 1, padding: "9px 12px", borderRadius: 9, border: "none",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 700, transition: "all 0.2s",
              background: activeTab === t.id ? "#1e1e2c" : "transparent",
              color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              {t.label}
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 20,
                background: activeTab === t.id ? `${t.color}22` : "rgba(255,255,255,0.06)",
                color: activeTab === t.id ? t.color : "rgba(255,255,255,0.25)",
                fontWeight: 700, minWidth: 18, textAlign: "center",
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        {user && (activeTab === "hosted"
          ? <ActivityGrid items={user.hostedEvents} label="Hosted" color="#FF6B35" onOpen={onOpen} />
          : <ActivityGrid items={user.joinedEvents} label="Joined" color="#60A5FA" onOpen={onOpen} />
        )}

        {/* Photos & Videos Section */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.4, fontFamily: "'DM Sans', sans-serif", margin: "0 0 16px" }}>Photos & Videos</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
            {user.media.map(item => (
              <div
                key={item.id}
                style={{
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}40`,
                  borderRadius: 12,
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                  gap: 0,
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "120px",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${item.color}25`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${item.color}15`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {item.image ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "8px",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 10, color: item.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {item.type === "photo" ? "📷 Photo" : "🎬 Video"}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
