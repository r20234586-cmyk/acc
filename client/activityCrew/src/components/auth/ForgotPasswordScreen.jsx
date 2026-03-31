import { useState } from "react";
import api from "../../api/api";
import AuthLayout from "./AuthLayout";
import FormField from "./FormField";
import AuthError from "./AuthError";

export default function ForgotPasswordScreen({ onBack, onSignIn }) {
  const [email, setEmail]   = useState("");
  const [error, setError]   = useState("");
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [sent, setSent]           = useState(false);

  const handleSubmit = async () => {
    if (!email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }

    setLoading(true);
    setError("");
    setAuthError(null);

    try {
      const { data } = await api.post('/api/auth/request-password-reset', { email });
      setLoading(false);
      setSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.code === 'ERR_NETWORK') {
        setAuthError('network_error');
      } else if (error.response?.status === 404) {
        // Still show success message for security (don't reveal if email exists)
        setSent(true);
      } else {
        setAuthError('server_error');
      }
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle="" onBack={onBack}>
        <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
            background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          }}>✉</div>
          <p style={{
            fontSize: 14, color: "rgba(255,255,255,0.55)",
            fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, marginBottom: 8,
          }}>
            We sent a reset link to
          </p>
          <p style={{
            fontSize: 14, fontWeight: 700, color: "#fff",
            fontFamily: "'DM Sans', sans-serif", marginBottom: 24,
          }}>{email}</p>
          <p style={{
            fontSize: 12, color: "rgba(255,255,255,0.3)",
            fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
          }}>
            Didn't get it? Check your spam folder or{" "}
            <button onClick={() => setSent(false)} style={{
              background: "none", border: "none", color: "#FF6B35",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: 700,
            }}>try again</button>
          </p>
        </div>
        <button onClick={onSignIn} style={{
          width: "100%", padding: "14px", borderRadius: 50, border: "none",
          cursor: "pointer", background: "linear-gradient(135deg, #FF6B35, #e85a28)",
          color: "#fff", fontSize: 14, fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif", marginTop: 8,
        }}>Back to Sign In</button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a reset link."
      onBack={onBack}
    >
      {authError && <AuthError type={authError} onDismiss={() => setAuthError(null)} />}

      <FormField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={v => { setEmail(v); setError(""); }}
        error={error}
        autoComplete="email"
      />

      <button onClick={handleSubmit} disabled={loading} style={{
        width: "100%", padding: "14px", borderRadius: 50, border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        background: loading ? "rgba(255,107,53,0.5)" : "linear-gradient(135deg, #FF6B35, #e85a28)",
        color: "#fff", fontSize: 14, fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif", marginTop: 4,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: loading ? "none" : "0 4px 16px rgba(255,107,53,0.35)",
        transition: "all 0.2s",
      }}>
        {loading && <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span>}
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  );
}
