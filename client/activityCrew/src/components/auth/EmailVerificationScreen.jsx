import { useState } from "react";
import api from "../../api/api";
import AuthLayout from "./AuthLayout";

export default function EmailVerificationScreen({ email, onResend, onBack }) {
  const [resent, setResent]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/resend-verification', { email });
      setLoading(false);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (error) {
      console.error('Resend verification error:', error);
      setLoading(false);
      // Still show success for security reasons
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle="" onBack={onBack}>
      <div style={{ textAlign: "center" }}>
        {/* Animated envelope */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
          background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 34, animation: "pulse 2s ease infinite",
        }}>✉</div>

        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.5)",
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, marginBottom: 6,
        }}>We sent a verification link to</p>
        <p style={{
          fontSize: 15, fontWeight: 700, color: "#fff",
          fontFamily: "'DM Sans', sans-serif", marginBottom: 28,
        }}>{email || "your email"}</p>

        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "16px", marginBottom: 24, textAlign: "left",
        }}>
          {[
            "Open the email from Activity Crew",
            "Click the verification link",
            "You'll be signed in automatically",
          ].map((step, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#FF6B35",
                fontFamily: "'DM Sans', sans-serif",
              }}>{i + 1}</div>
              <span style={{
                fontSize: 13, color: "rgba(255,255,255,0.6)",
                fontFamily: "'DM Sans', sans-serif",
              }}>{step}</span>
            </div>
          ))}
        </div>

        {resent && (
          <div style={{
            padding: "10px 16px", borderRadius: 10, marginBottom: 16,
            background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
            fontSize: 13, color: "#34D399", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
          }}>✓ Verification email resent!</div>
        )}

        <button onClick={handleResend} disabled={loading || resent} style={{
          width: "100%", padding: "13px", borderRadius: 50,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)",
          color: loading ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)",
          fontSize: 13, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif", cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {loading && <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span>}
          {loading ? "Sending..." : resent ? "Sent ✓" : "Resend verification email"}
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,107,53,0.2); }
          50% { transform: scale(1.04); box-shadow: 0 0 0 12px rgba(255,107,53,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </AuthLayout>
  );
}
