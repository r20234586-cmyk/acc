import { useState } from "react";

export default function FormField({
  label, type = "text", placeholder, value, onChange,
  error, autoComplete,
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        color: error ? "#FC8181" : "rgba(255,255,255,0.4)",
        textTransform: "uppercase", letterSpacing: 1,
        fontFamily: "'DM Sans', sans-serif", marginBottom: 7,
        transition: "color 0.2s",
      }}>{label}</label>

      <div style={{ position: "relative" }}>
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: isPassword ? "13px 44px 13px 16px" : "13px 16px",
            background: focused
              ? "rgba(255,255,255,0.07)"
              : error
              ? "rgba(252,129,129,0.06)"
              : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${
              error ? "rgba(252,129,129,0.5)"
              : focused ? "rgba(255,107,53,0.6)"
              : "rgba(255,255,255,0.08)"
            }`,
            borderRadius: 12, color: "#fff", fontSize: 14,
            fontFamily: "'DM Sans', sans-serif", outline: "none",
            boxSizing: "border-box", transition: "all 0.2s",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "rgba(255,255,255,0.3)",
              cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1,
            }}
          >{showPassword ? "◡" : "◠"}</button>
        )}
      </div>

      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginTop: 6,
          animation: "shake 0.3s ease",
        }}>
          <span style={{ color: "#FC8181", fontSize: 12 }}>⚠</span>
          <span style={{
            fontSize: 12, color: "#FC8181",
            fontFamily: "'DM Sans', sans-serif",
          }}>{error}</span>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
