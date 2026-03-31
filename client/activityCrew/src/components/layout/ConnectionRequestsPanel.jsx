import Avatar from "../ui/Avatar";

export default function ConnectionRequestsPanel({ requests, onAccept, onDecline, onBack }) {
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
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", margin: 0 }}>
            Connection Requests
          </h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", margin: "2px 0 0" }}>
            {requests.length} pending
          </p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {requests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
              All caught up!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {requests.map(req => (
              <div key={req.id} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18, padding: "18px",
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
                  <Avatar initials={req.initials} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif" }}>
                          {req.name}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                          {req.distance} · {req.time}
                        </div>
                      </div>
                    </div>

                    {/* Via activity badge */}
                    <div style={{
                      marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6,
                      background: "rgba(255,107,53,0.12)", borderRadius: 20,
                      padding: "4px 10px",
                    }}>
                      <span style={{ fontSize: 10, color: "#FF6B35", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        via {req.activity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {req.interests.map(tag => (
                    <span key={tag} style={{
                      fontSize: 10, padding: "3px 10px", borderRadius: 20,
                      background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{tag}</span>
                  ))}
                  <span style={{
                    fontSize: 10, padding: "3px 10px", borderRadius: 20,
                    background: "rgba(96,165,250,0.1)", color: "#60A5FA",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  }}>
                    {req.mutualActivities} mutual activities
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => onAccept(req.id)} style={{
                    flex: 1, padding: "10px", borderRadius: 50, border: "none",
                    background: "linear-gradient(135deg, #34D399, #34D39988)",
                    color: "#fff", fontSize: 13, fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  }}>
                    Accept
                  </button>
                  <button onClick={() => onDecline(req.id)} style={{
                    flex: 1, padding: "10px", borderRadius: 50,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  }}>
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
