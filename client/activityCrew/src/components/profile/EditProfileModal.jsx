import { useState } from "react";

const ACTIVITY_INTERESTS = ["Sports", "Fitness", "Music", "Study", "Gaming", "Social", "Tech", "Language"];

export default function EditProfileModal({ onClose, onSave, initialData = {} }) {
  const [name, setName] = useState(initialData.name || "User");
  const [bio, setBio] = useState(initialData.bio || "");
  const [location, setLocation] = useState(initialData.location || "");
  const [selectedInterests, setSelectedInterests] = useState(initialData.interests || []);
  const [profilePictureUrl, setProfilePictureUrl] = useState(initialData.profilePicture || null);
  const [fileName, setFileName] = useState("");
  const [mediaItems, setMediaItems] = useState(initialData.media || []);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaType, setNewMediaType] = useState("photo");
  const [newMediaFile, setNewMediaFile] = useState(null);
  const [newMediaPreview, setNewMediaPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        name,
        bio,
        location,
        interests: selectedInterests,
        profilePicture: profilePictureUrl,
        media: mediaItems,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMedia = () => {
    if (newMediaTitle.trim() && newMediaFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const colors = ["#FF6B35", "#A78BFA", "#34D399", "#60A5FA", "#FBBF24", "#F472B6"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        setMediaItems([...mediaItems, {
          id: Math.max(...mediaItems.map(m => m.id), 0) + 1,
          type: newMediaType,
          title: newMediaTitle,
          image: reader.result,
          color,
        }]);
        setNewMediaTitle("");
        setNewMediaType("photo");
        setNewMediaFile(null);
        setNewMediaPreview(null);
        setShowMediaForm(false);
      };
      reader.readAsDataURL(newMediaFile);
    }
  };

  const handleMediaFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = (id) => {
    setMediaItems(mediaItems.filter(m => m.id !== id));
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "#13131c",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.09)",
        width: "100%",
        maxWidth: "480px",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "28px 24px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
      }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 800, color: "#fff", margin: 0,
            fontFamily: "'Syne', sans-serif"
          }}>Edit Profile</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "rgba(255,255,255,0.4)",
            fontSize: 20, cursor: "pointer", padding: 0,
          }}>✕</button>
        </div>

        {/* Profile Picture Upload */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: "block", fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 10,
            fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 0.5,
          }}>Profile Picture</label>
          <div style={{
            border: "2px dashed rgba(255,107,53,0.3)",
            borderRadius: 12,
            padding: "24px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "rgba(255,107,53,0.05)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#FF6B35";
            e.currentTarget.style.backgroundColor = "rgba(255,107,53,0.1)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(255,107,53,0.3)";
            e.currentTarget.style.backgroundColor = "rgba(255,107,53,0.05)";
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="profile-pic-input"
            />
            <label htmlFor="profile-pic-input" style={{ cursor: "pointer" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
              <div style={{
                fontSize: 12, color: "#FF6B35", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                marginBottom: 4,
              }}>Click to upload</div>
              <div style={{
                fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif",
              }}>or drag and drop</div>
              {fileName && (
                <div style={{
                  fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}>📄 {fileName}</div>
              )}
            </label>
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: "block", fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 8,
            fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 0.5,
          }}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: "100%", padding: "11px 14px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
              color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              outline: "none", transition: "border 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        {/* Location */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: "block", fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 8,
            fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 0.5,
          }}>Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Your city or area"
            style={{
              width: "100%", padding: "11px 14px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
              color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              outline: "none", transition: "border 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: "block", fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 8,
            fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 0.5,
          }}>Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
            style={{
              width: "100%", padding: "11px 14px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
              color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              outline: "none", transition: "border 0.2s",
              minHeight: "80px", resize: "vertical",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        {/* Interests */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: "block", fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 10,
            fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 0.5,
          }}>Activity Interests</label>
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

        {/* Photos & Videos Section */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: "block", fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 10,
            fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 0.5,
          }}>Photos & Videos</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
            {mediaItems.map(item => (
              <div
                key={item.id}
                style={{
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}40`,
                  borderRadius: 8,
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: 6,
                  position: "relative",
                  minHeight: "100px",
                  overflow: "hidden",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: 4 }}
                  />
                ) : null}
                <div style={{ fontSize: 9, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                  {item.title}
                </div>
                <button
                  onClick={() => handleRemoveMedia(item.id)}
                  style={{
                    position: "absolute", top: 2, right: 2, width: 18, height: 18,
                    borderRadius: "50%", background: "rgba(255,73,100,0.8)",
                    border: "none", color: "#fff", fontSize: 11, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FC5A80"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,73,100,0.8)"}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add Media Form */}
          {showMediaForm ? (
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 12,
              display: "flex", flexDirection: "column", gap: 8, marginBottom: 12,
            }}>
              <input
                type="text"
                placeholder="Media title"
                value={newMediaTitle}
                onChange={e => setNewMediaTitle(e.target.value)}
                style={{
                  padding: "8px 12px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                  color: "#fff", fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                }}
              />

              {/* Image file input */}
              <div style={{
                border: "2px dashed rgba(255,107,53,0.3)",
                borderRadius: 8,
                padding: "12px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "rgba(255,107,53,0.05)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#FF6B35";
                e.currentTarget.style.backgroundColor = "rgba(255,107,53,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,107,53,0.3)";
                e.currentTarget.style.backgroundColor = "rgba(255,107,53,0.05)";
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMediaFileChange}
                  style={{ display: "none" }}
                  id="media-file-input"
                />
                <label htmlFor="media-file-input" style={{ cursor: "pointer", display: "block" }}>
                  <div style={{ fontSize: 14, color: "#FF6B35", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                    {newMediaFile ? newMediaFile.name : "Select Image"}
                  </div>
                </label>
              </div>

              {newMediaPreview && (
                <img
                  src={newMediaPreview}
                  alt="Preview"
                  style={{ maxHeight: "80px", borderRadius: 8, objectFit: "cover" }}
                />
              )}

              <select
                value={newMediaType}
                onChange={e => setNewMediaType(e.target.value)}
                style={{
                  padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                }}
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleAddMedia}
                  disabled={!newMediaTitle.trim() || !newMediaFile}
                  style={{
                    flex: 1, padding: "8px 16px", borderRadius: 8, border: "none",
                    background: (!newMediaTitle.trim() || !newMediaFile) ? "rgba(255,107,53,0.3)" : "#FF6B35",
                    color: "#fff", fontSize: 12,
                    fontWeight: 600, cursor: (!newMediaTitle.trim() || !newMediaFile) ? "not-allowed" : "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => { if (newMediaTitle.trim() && newMediaFile) e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={e => { if (newMediaTitle.trim() && newMediaFile) e.currentTarget.style.opacity = "1"; }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowMediaForm(false);
                    setNewMediaTitle("");
                    setNewMediaFile(null);
                    setNewMediaPreview(null);
                  }}
                  style={{
                    flex: 1, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 12,
                    fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowMediaForm(true)}
              style={{
                width: "100%", padding: 12, borderRadius: 8,
                border: "1px dashed rgba(255,107,53,0.3)", background: "rgba(255,107,53,0.05)",
                color: "#FF6B35", fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#FF6B35";
                e.currentTarget.style.background = "rgba(255,107,53,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,107,53,0.3)";
                e.currentTarget.style.background = "rgba(255,107,53,0.05)";
              }}
            >
              + Add Photo
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 50, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)",
            fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: "12px", borderRadius: 50, border: "none",
            background: saving ? "rgba(255,107,53,0.5)" : "linear-gradient(135deg, #FF6B35, #e85a28)",
            color: "#fff",
            fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            cursor: saving ? "not-allowed" : "pointer", transition: "all 0.2s",
            boxShadow: "0 4px 16px rgba(255,107,53,0.35)",
          }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,107,53,0.45)"; }}
          onMouseLeave={e => { if (!saving) e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,107,53,0.35)"; }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
