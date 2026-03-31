import { useState } from "react";

export function useProfile() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    location: "Hyderabad",
    avatarUrl: null, // null = use initials fallback
    initials: "ME",
    interests: ["Badminton", "Running", "Board Games"],
    rating: 4.9,
    joinedDate: "March 2025",
  });

  const updateAvatar = (dataUrl) => {
    setProfile(p => ({ ...p, avatarUrl: dataUrl }));
  };

  const updateProfile = (updates) => {
    setProfile(p => ({ ...p, ...updates }));
  };

  return { profile, updateAvatar, updateProfile };
}
