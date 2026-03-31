import { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import api from "../../api/api";
import AuthLayout from "./AuthLayout";
import FormField from "./FormField";
import GoogleButton from "./GoogleButton";
import Divider from "./Divider";
import AuthError from "./AuthError";

function validate(email, password) {
  const errors = {};
  if (!email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
}

export default function SignInScreen({ onSuccess, onSignUp, onBack, onForgotPassword }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async () => {
    const errors = validate(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    setAuthError(null);

    try {
      const { data } = await api.post('/api/auth/login', {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setLoading(false);
      onSuccess(data.user);
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle specific authentication errors
      const errorMessage = error.response?.data?.error?.message;
      const statusCode = error.response?.status;
      
      if (errorMessage?.includes('Invalid email or password')) {
        setAuthError('wrong_password');
      } else if (errorMessage?.includes('locked')) {
        setAuthError('too_many_attempts');
      } else if (error.code === 'ERR_NETWORK') {
        setAuthError('network_error');
      } else if (statusCode === 400 || statusCode === 401) {
        setAuthError('wrong_password');
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
        onSuccess(data.user);
      } catch (error) {
        console.error('Google login error:', error);
        if (error.code === 'ERR_NETWORK') {
          setAuthError('network_error');
        } else if (error.response?.status >= 500) {
          setAuthError('server_error');
        } else {
          setAuthError('google_failed');
        }
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setAuthError('server_error');
    },
  });

  const handleGoogle = () => {
    handleGoogleAuth();
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to find activities near you."
      onBack={onBack}
    >
      {authError && (
        <AuthError
          type={authError}
          onDismiss={() => setAuthError(null)}
        />
      )}

      <GoogleButton onClick={handleGoogle} loading={googleLoading} />
      <Divider />

      <FormField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={v => { setEmail(v); setFieldErrors(e => ({ ...e, email: "" })); }}
        error={fieldErrors.email}
        autoComplete="email"
      />
      <FormField
        label="Password"
        type="password"
        placeholder="Your password"
        value={password}
        onChange={v => { setPassword(v); setFieldErrors(e => ({ ...e, password: "" })); }}
        error={fieldErrors.password}
        autoComplete="current-password"
      />

      <div style={{ textAlign: "right", marginTop: -8, marginBottom: 20 }}>
        <button onClick={onForgotPassword} style={{
          background: "none", border: "none", color: "#FF6B35",
          fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
        }}>Forgot password?</button>
      </div>

      <button onClick={handleSubmit} disabled={loading} style={{
        width: "100%", padding: "14px", borderRadius: 50, border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        background: loading ? "rgba(255,107,53,0.5)" : "linear-gradient(135deg, #FF6B35, #e85a28)",
        color: "#fff", fontSize: 14, fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 0.2s",
        boxShadow: loading ? "none" : "0 4px 16px rgba(255,107,53,0.35)",
      }}>
        {loading && <span style={{ animation: "spin 1s linear infinite", display: "inline-block", fontSize: 16 }}>◌</span>}
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p style={{
        textAlign: "center", marginTop: 20, fontSize: 13,
        color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif",
      }}>
        Don't have an account?{" "}
        <button onClick={onSignUp} style={{
          background: "none", border: "none", color: "#FF6B35",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 700,
        }}>Sign up</button>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  );
}
