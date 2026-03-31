import { useState, useEffect } from "react";

export const AUTH_SCREENS = {
  LANDING:      "landing",
  SIGN_IN:      "sign_in",
  SIGN_UP:      "sign_up",
  FORGOT:       "forgot",
  VERIFY_EMAIL: "verify_email",
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already logged in (token exists)
    return !!localStorage.getItem('token');
  });
  const [authScreen, setAuthScreen]           = useState(AUTH_SCREENS.LANDING);
  const [pendingEmail, setPendingEmail]       = useState("");
  const [user, setUser]                       = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const signIn  = (userData) => {
    setIsAuthenticated(true);
    setAuthScreen(AUTH_SCREENS.LANDING);
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };
  
  const signOut = () => { 
    setIsAuthenticated(false); 
    setAuthScreen(AUTH_SCREENS.LANDING); 
    setPendingEmail("");
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const goTo = (screen, opts = {}) => {
    if (opts.email !== undefined) setPendingEmail(opts.email);
    setAuthScreen(screen);
  };

  return { isAuthenticated, authScreen, pendingEmail, signIn, signOut, goTo, AUTH_SCREENS, user };
}
