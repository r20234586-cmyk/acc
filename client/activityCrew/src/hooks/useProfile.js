import { useState, useEffect } from "react";
import api from "../api/api";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/auth/profile');
        setProfile(res.data);
      } catch (err) {
        console.warn('[useProfile] fetch failed:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateAvatar = (dataUrl) => {
    setProfile(p => ({ ...p, profilePicture: dataUrl }));
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/api/auth/profile', updates);
      setProfile(res.data);
    } catch (err) {
      console.warn('[useProfile] update failed:', err.message);
      throw err;
    }
  };

  return { profile, loading, updateAvatar, updateProfile };
}
