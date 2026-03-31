import { useState, useEffect } from "react";
import { CATEGORIES } from "../../data/constants";
import Avatar from "../ui/Avatar";
import EditProfileModal from "./EditProfileModal";
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

export default function ProfileView({ onLogout, onOpen, hostedActivities = [], joinedActivities = [] }) {
  const [activeTab, setActiveTab] = useState("hosted");
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [peopleMet, setPeopleMet] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get('/api/auth/profile');
        const u = data.user || data; // backend returns { user: {...} }
        setProfileData({
          name: u.name,
          interests: u.interests || [],
          location: u.location,
          bio: u.bio || 'No bio yet',
          profilePicture: u.profilePicture,
          media: u.media || [],
        });

        // Count unique people from hosted and joined activities
        const uniquePeople = new Set();
        hostedActivities.forEach(a => {
          if (a.joined) a.joined.forEach(id => uniquePeople.add(id));
        });
        joinedActivities.forEach(a => {
          if (a.joined) a.joined.forEach(id => uniquePeople.add(id));
        });
        setPeopleMet(uniquePeople.size);

        setStatsData({
          hosted: hostedActivities.length,
          joined: joinedActivities.length,
          people: uniquePeople.size,
          rating: u.rating || 0,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Set default data if fetch fails
        setProfileData({
          name: "User",
          interests: [],
          location: "Not specified",
          bio: "No bio yet",
          profilePicture: null,
          media: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [hostedActivities, joinedActivities]);

  const tabs = [
    { id: "hosted", label: "Hosted", count: hostedActivities.length, color: "#FF6B35" },
    { id: "joined", label: "Joined", count: joinedActivities.length, color: "#60A5FA" },
  ];

  const handleEditSave = async (updatedData) => {
    try {
      await api.put('/api/auth/profile', {
        name: updatedData.name,
        bio: updatedData.bio,
        location: updatedData.location,
        interests: updatedData.interests,
        profilePicture: updatedData.profilePicture,
        media: updatedData.media,
      });

      // Update local state after successful save
      setProfileData({
        name: updatedData.name,
        interests: updatedData.interests,
        location: updatedData.location,
        bio: updatedData.bio || 'No bio yet',
        profilePicture: updatedData.profilePicture,
        media: updatedData.media || [],
      });

      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Keep modal open on error
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
            {profileData?.profilePicture ? (
              <img
                src={profileData.profilePicture}
                alt={profileData.name}
                style={{
                  width: 68, height: 68, borderRadius: 12,
                  objectFit: "cover"
                }}
              />
            ) : (
              <Avatar initials={profileData?.name?.split(' ').map(n => n[0]).join('') || "ME"} size={68} color="#60A5FA" />
            )}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 3px", fontFamily: "'Syne', sans-serif" }}>
                {profileData?.name || "Loading..."}
              </h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                📍 {profileData?.location} · Member since 2025
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setShowEditModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.45)", fontSize: 12,
              fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(96,165,250,0.12)"; e.currentTarget.style.color = "#60A5FA"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            ✎ Edit
          </button>
        </div>

        {/* Bio */}
        {profileData?.bio && profileData.bio !== 'No bio yet' && (
          <p style={{
            fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.5, margin: "12px 0 0",
          }}>
            {profileData.bio}
          </p>
        )}

        {/* Interest tags */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: profileData?.bio && profileData.bio !== 'No bio yet' ? 12 : 0 }}>
          {profileData?.interests?.map(tag => (
            <span key={tag} style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 20,
              background: "rgba(96,165,250,0.12)", color: "#60A5FA",
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
        {statsData && [
          { label: "Hosted",  value: statsData.hosted, color: "#FF6B35" },
          { label: "Joined",  value: statsData.joined, color: "#60A5FA" },
          { label: "People",  value: statsData.people, color: "#34D399" },
          { label: "Rating",  value: statsData.rating.toFixed(1), color: "#A78BFA" },
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
          {tabs.map(t => (
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

        {activeTab === "hosted"
          ? <ActivityGrid items={hostedActivities} label="Hosted" color="#FF6B35" onOpen={onOpen} />
          : <ActivityGrid items={joinedActivities} label="Joined" color="#60A5FA" onOpen={onOpen} />
        }

        {/* Photos & Videos Section */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.4, fontFamily: "'DM Sans', sans-serif", margin: "0 0 16px" }}>Photos & Videos</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
            {profileData?.media?.map(item => (
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
                  overflow: "hidden",
                  position: "relative",
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
            {/* Add new media button */}
            <div
              onClick={() => setShowEditModal(true)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "2px dashed rgba(255,107,53,0.3)",
                borderRadius: 12,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "center",
                gap: 8,
                minHeight: "120px",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,107,53,0.1)";
                e.currentTarget.style.borderColor = "#FF6B35";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,107,53,0.3)";
              }}
            >
              <div style={{ fontSize: 28 }}>+</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#FF6B35", fontFamily: "'DM Sans', sans-serif" }}>
                Add Media
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ padding: "0 24px 32px", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
        <button
          onClick={onLogout}
          style={{
            width: "100%", padding: "12px", borderRadius: 50,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.45)", fontSize: 13,
            fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,50,50,0.12)"; e.currentTarget.style.color = "#FC8181"; e.currentTarget.style.borderColor = "rgba(220,50,50,0.25)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          ⎋ Logout
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && profileData && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
          initialData={profileData}
        />
      )}
    </div>
  );
}
