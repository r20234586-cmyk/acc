const ERROR_CONFIGS = {
  wrong_password:    { icon: "🔒", title: "Wrong password",        message: "The password you entered is incorrect. Try again or reset it." },
  user_not_found:    { icon: "◎", title: "Account not found",      message: "No account exists with this email. Want to sign up instead?" },
  email_taken:       { icon: "✉", title: "Email already in use",   message: "An account with this email already exists. Try signing in." },
  google_failed:     { icon: "⚠", title: "Google sign-in failed",  message: "We couldn't connect to Google. Check your connection and try again." },
  network_error:     { icon: "◌", title: "No connection",          message: "You appear to be offline. Check your internet and try again." },
  server_error:      { icon: "⚙", title: "Something went wrong",   message: "Our servers hit a snag. Please try again in a moment." },
  email_not_verified:{ icon: "✉", title: "Verify your email",      message: "We sent a verification link to your email. Please check your inbox." },
  too_many_attempts: { icon: "🔒", title: "Too many attempts",      message: "Account temporarily locked. Please wait 15 minutes or reset your password." },
  weak_password:     { icon: "⚠", title: "Password too weak",      message: "Use at least 8 characters with a mix of letters, numbers, and symbols." },
  session_expired:   { icon: "◷", title: "Session expired",        message: "You've been signed out. Please sign in again to continue." },
};

export default function AuthError({ type, onDismiss, customMessage }) {
  const config = ERROR_CONFIGS[type] || {
    icon: "⚠", title: "Something went wrong", message: customMessage || "An unexpected error occurred.",
  };

  return (
    <div style={{
      display: "flex", gap: 12, padding: "14px 16px",
      background: "rgba(252,129,129,0.08)",
      border: "1px solid rgba(252,129,129,0.25)",
      borderRadius: 12, marginBottom: 20,
      animation: "fadeIn 0.3s ease",
    }}>
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{config.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "#FC8181",
          fontFamily: "'DM Sans', sans-serif", marginBottom: 2,
        }}>{config.title}</div>
        <div style={{
          fontSize: 12, color: "rgba(252,129,129,0.7)",
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5,
        }}>{config.message}</div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={{
          background: "none", border: "none", color: "rgba(252,129,129,0.4)",
          cursor: "pointer", fontSize: 16, padding: 0, flexShrink: 0,
          alignSelf: "flex-start", lineHeight: 1,
        }}>✕</button>
      )}
    </div>
  );
}

export { ERROR_CONFIGS };
