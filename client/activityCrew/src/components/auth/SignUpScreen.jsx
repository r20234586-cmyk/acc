import { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import api from "../../api/api";
import AuthLayout from "./AuthLayout";
import FormField from "./FormField";
import GoogleButton from "./GoogleButton";
import Divider from "./Divider";
import AuthError from "./AuthError";

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ chars",    ok: password.length >= 8 },
    { label: "Uppercase",   ok: /[A-Z]/.test(password) },
    { label: "Number",      ok: /[0-9]/.test(password) },
    { label: "Symbol",      ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["#FC8181", "#FC8181", "#FBBF24", "#34D399", "#34D399"];
  const labels = ["", "Weak", "Weak", "Good", "Strong"];

  if (!password) return null;

  return (
    <div style={{ marginTop: -8, marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? colors[score] : "rgba(255,255,255,0.1)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {checks.map(c => (
            <span key={c.label} style={{
              fontSize: 10, fontFamily: "'DM Sans', sans-serif",
              color: c.ok ? "#34D399" : "rgba(255,255,255,0.2)",
              fontWeight: c.ok ? 600 : 400,
              transition: "color 0.2s",
            }}>
              {c.ok ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span style={{ fontSize: 11, color: colors[score], fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
            {labels[score]}
          </span>
        )}
      </div>
    </div>
  );
}

function validate(name, email, password, confirm, location, selectedInterests) {
  const errors = {};
  if (!name.trim()) errors.name = "Full name is required";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email address";

  if (!password) errors.password = "Password is required";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters";
  else if (!/[A-Z]/.test(password)) errors.password = "Add at least one uppercase letter";
  else if (!/[0-9]/.test(password)) errors.password = "Add at least one number";

  if (!confirm) errors.confirm = "Please confirm your password";
  else if (confirm !== password) errors.confirm = "Passwords don't match";

  if (!location.trim()) errors.location = "Location is required";

  if (selectedInterests.length === 0) errors.interests = "Select at least one interest";

  return errors;
}

const ACTIVITY_INTERESTS = ["Sports", "Fitness", "Music", "Study", "Gaming", "Social", "Tech", "Language"];
const TIME_PREFERENCES = ["Morning (6-9 AM)", "Afternoon (12-3 PM)", "Evening (5-8 PM)", "Night (8 PM+)"];

export default function SignUpScreen({ onSuccess, onSignIn, onBack }) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [location, setLocation] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const clearField = key => setFieldErrors(e => ({ ...e, [key]: "" }));

  const handleSubmit = async () => {
    const errors = validate(name, email, password, confirm, location, selectedInterests);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    setAuthError(null);

    try {
      const { data } = await api.post('/api/auth/register', {
        name,
        email,
        password,
        location,
        interests: selectedInterests,
        timePreferences: selectedTimes,
      });

      setLoading(false);
      onSuccess(email);
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle validation errors from backend
      const backendFields = error.response?.data?.error?.fields;
      if (backendFields) {
        console.error('Backend validation errors:', backendFields);
        // If there are validation errors, show them in field errors
        if (backendFields.password) {
          setFieldErrors(prev => ({...prev, password: backendFields.password}));
        }
        if (backendFields.email) {
          // Check if it's the email taken error
          if (backendFields.email.includes('Email already in use') || 
              backendFields.email.includes('already')) {
            setAuthError('email_taken');
          } else {
            setFieldErrors(prev => ({...prev, email: backendFields.email}));
          }
        }
        if (Object.keys(backendFields).length > 0 && !backendFields.email && !backendFields.password) {
          setAuthError('server_error');
        }
      } else if (error.code === 'ERR_NETWORK') {
        setAuthError('network_error');
      } else {
        setAuthError('server_error');
      }
      setLoading(false);
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (codeResponse) => {
      setGoogleLoading(true);
      setAuthError(null);
      try {
        const { data } = await api.post('/api/auth/google', {
          access_token: codeResponse.access_token,
        });

        // Store token in localStorage
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        setGoogleLoading(false);
        onSuccess(data.user.email);
      } catch (error) {
        console.error('Google signup error:', error);
        setAuthError('server_error');
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google signup error:', error);
      setAuthError('server_error');
    },
  });

  const handleGoogle = () => {
    handleGoogleAuth();
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Activity Crew and find people who share your interests."
      onBack={onBack}
    >
      {authError && <AuthError type={authError} onDismiss={() => setAuthError(null)} />}

      <GoogleButton onClick={handleGoogle} loading={googleLoading} label="Sign up with Google" />
      <Divider />

      <FormField label="Full Name" placeholder="Alex Johnson" value={name}
        onChange={v => { setName(v); clearField("name"); }} error={fieldErrors.name} autoComplete="name" />

      <FormField label="Email" type="email" placeholder="you@example.com" value={email}
        onChange={v => { setEmail(v); clearField("email"); }} error={fieldErrors.email} autoComplete="email" />

      <FormField label="Password" type="password" placeholder="Create a strong password" value={password}
        onChange={v => { setPassword(v); clearField("password"); }} error={fieldErrors.password} autoComplete="new-password" />

      <PasswordStrength password={password} />

      <FormField label="Confirm Password" type="password" placeholder="Repeat your password" value={confirm}
        onChange={v => { setConfirm(v); clearField("confirm"); }} error={fieldErrors.confirm} autoComplete="new-password" />

      <FormField label="Location" placeholder="Your city or area" value={location}
        onChange={v => { setLocation(v); clearField("location"); }} error={fieldErrors.location} />

      {/* Activity Interests Section */}
      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <label style={{
          display: "block", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 10,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          What activities interest you? {fieldErrors.interests && <span style={{ color: "#FC8181" }}>({fieldErrors.interests})</span>}
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ACTIVITY_INTERESTS.map(interest => (
            <button
              key={interest}
              onClick={() => setSelectedInterests(prev =>
                prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
              )}
              type="button"
              style={{
                padding: "8px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.2)",
                background: selectedInterests.includes(interest) ? "#FF6B35" : "rgba(255,255,255,0.04)",
                color: selectedInterests.includes(interest) ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                if (!selectedInterests.includes(interest)) {
                  e.currentTarget.style.borderColor = "#FF6B35";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }
              }}
              onMouseLeave={e => {
                if (!selectedInterests.includes(interest)) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }
              }}
            >
              {selectedInterests.includes(interest) && "✓ "}{interest}
            </button>
          ))}
        </div>
      </div>

      {/* Time Preferences Section */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: "block", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 10,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          When do you prefer to join activities? (Optional)
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TIME_PREFERENCES.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTimes(prev =>
                prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
              )}
              type="button"
              style={{
                padding: "8px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.2)",
                background: selectedTimes.includes(time) ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.04)",
                color: selectedTimes.includes(time) ? "#60A5FA" : "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                if (!selectedTimes.includes(time)) {
                  e.currentTarget.style.borderColor = "#60A5FA";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }
              }}
              onMouseLeave={e => {
                if (!selectedTimes.includes(time)) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }
              }}
            >
              {selectedTimes.includes(time) && "✓ "}{time}
            </button>
          ))}
        </div>
      </div>

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
        {loading && <span style={{ animation: "spin 1s linear infinite", display: "inline-block", fontSize: 16 }}>◌</span>}
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <p style={{
        textAlign: "center", marginTop: 20, fontSize: 13,
        color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif",
      }}>
        Already have an account?{" "}
        <button onClick={onSignIn} style={{
          background: "none", border: "none", color: "#FF6B35",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 700,
        }}>Sign in</button>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  );
}
