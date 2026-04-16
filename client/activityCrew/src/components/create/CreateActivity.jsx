import { useState, useRef } from "react";
import { CATEGORIES } from "../../data/constants";
import BackButton from "../ui/BackButton";

const INPUT_STYLE = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 14,
  padding: "13px 16px",
  color: "#fff",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  marginBottom: 14,
};

const LABEL_STYLE = {
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase",
  letterSpacing: 1,
  fontFamily: "'DM Sans', sans-serif",
  display: "block",
  marginBottom: 6,
};

const DEFAULT_FORM = {
  title: "", category: "sports", description: "",
  location: "", date: "", time: "", max: "8",
  activityType: "casual",
};

const ACTIVITY_TYPES = [
  { id: "casual", label: "Casual", icon: "◎" },
  { id: "corporate", label: "Corporate", icon: "◈" },
  { id: "hackathon", label: "Hackathon", icon: "⚡" },
  { id: "tournament", label: "Tournament", icon: "◆" },
];

export default function CreateActivity({ onBack, onCreate }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [mediaFiles, setMediaFiles] = useState([]);  // { type, url, name, file }
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState(1); // 1 = details, 2 = media
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const selectedCategory = CATEGORIES.find((c) => c.id === form.category);

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files).map(file => ({
      type: file.type.startsWith("video") ? "video" : "image",
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    setMediaFiles(prev => [...prev, ...newFiles].slice(0, 6)); // max 6 files
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!form.title || !form.location || !hasValidDateTime) return;
    const selectedCategory = CATEGORIES.find((c) => c.id === form.category);
    onCreate({
      ...form,
      max: parseInt(form.max) || 8,
      joined: 1,
      host: "You",
      hostAvatar: "ME",
      id: Date.now(),
      distance: "0.1 km",
      color: selectedCategory?.color || "#FF6B35",
      attendees: ["ME"],
      tags: [form.category, form.activityType],
      // keep date and time separately for addActivity to create a valid ISO timestamp
      time: form.time || "",
      media: mediaFiles.map(m => ({ type: m.type, url: m.url, name: m.name })),
      coverImage: mediaFiles.find(m => m.type === "image")?.url || null,
      coverVideo: mediaFiles.find(m => m.type === "video")?.url || null,
    });
    onBack();
  };

  const accentColor = selectedCategory?.color || "#FF6B35";
  const hasValidDateTime = !!(form.date && form.time && !Number.isNaN(new Date(`${form.date}T${form.time}`).getTime()));
  const canProceed = form.title && form.location && hasValidDateTime;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0d0d12" }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
      }}>
        <BackButton onBack={step === 2 ? () => setStep(1) : onBack} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, fontFamily: "'Syne', sans-serif" }}>
            {step === 1 ? "New Activity" : "Add Media"}
          </h2>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "2px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
            Step {step} of 2
          </p>
        </div>
        {/* Step dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              width: s === step ? 20 : 6, height: 6, borderRadius: 3,
              background: s === step ? accentColor : s < step ? `${accentColor}66` : "rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", scrollbarWidth: "none" }}>

        {step === 1 && (
          <>
            {/* Activity Type */}
            <label style={LABEL_STYLE}>Activity Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 18 }}>
              {ACTIVITY_TYPES.map(type => (
                <button key={type.id} onClick={() => set("activityType", type.id)} style={{
                  padding: "10px 6px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: form.activityType === type.id ? `${accentColor}22` : "rgba(255,255,255,0.04)",
                  border: form.activityType === type.id ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.07)",
                  color: form.activityType === type.id ? accentColor : "rgba(255,255,255,0.4)",
                  fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 4,
                }}>
                  <span style={{ fontSize: 16 }}>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <label style={LABEL_STYLE}>Activity Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. Badminton Doubles, React Hackathon..." style={INPUT_STYLE} />

            {/* Category */}
            <label style={LABEL_STYLE}>Category</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {CATEGORIES.filter(c => c.id !== "all").map(cat => (
                <button key={cat.id} onClick={() => set("category", cat.id)} style={{
                  padding: "7px 13px", borderRadius: 50, border: "none", cursor: "pointer",
                  background: form.category === cat.id ? cat.color : "rgba(255,255,255,0.06)",
                  color: form.category === cat.id ? "#fff" : "rgba(255,255,255,0.5)",
                  fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Description */}
            <label style={LABEL_STYLE}>Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Tell people what to expect, requirements, agenda..." rows={3}
              style={{ ...INPUT_STYLE, resize: "none", lineHeight: 1.6 }} />

            {/* Location */}
            <label style={LABEL_STYLE}>Location *</label>
            <input value={form.location} onChange={e => set("location", e.target.value)}
              placeholder="e.g. T-Hub, IIIT Campus, Hyderabad" style={INPUT_STYLE} />

            {/* Date & Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={LABEL_STYLE}>Date</label>
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Time</label>
                <input type="time" value={form.time} onChange={e => set("time", e.target.value)} style={INPUT_STYLE} />
              </div>
            </div>

            {(!form.date || !form.time || !hasValidDateTime) && (
              <p style={{ color: "#FF7676", fontSize: 12, marginTop: -8, marginBottom: 12 }}>
                Enter a valid date and time before continuing.
              </p>
            )}

            {/* Max Participants */}
            <label style={LABEL_STYLE}>Max Participants</label>
            <input type="number" min={2} max={500} value={form.max}
              onChange={e => set("max", e.target.value)} style={INPUT_STYLE} />
          </>
        )}

        {step === 2 && (
          <>
            {/* Upload tip */}
            <div style={{
              background: `${accentColor}10`, border: `1px solid ${accentColor}30`,
              borderRadius: 14, padding: "12px 16px", marginBottom: 20,
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>
                  Media for invitations & promotion
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                  Upload images or videos to make your activity stand out. Perfect for corporate events, hackathons, and tournaments. Shown as a preview card in the feed.
                </div>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              style={{
                border: `2px dashed ${dragOver ? accentColor : "rgba(255,255,255,0.12)"}`,
                borderRadius: 18, padding: "32px 20px", textAlign: "center",
                background: dragOver ? `${accentColor}08` : "rgba(255,255,255,0.02)",
                transition: "all 0.2s", marginBottom: 16, cursor: "pointer",
              }}
              onClick={() => imageInputRef.current?.click()}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>🖼️</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
                Drag & drop images here
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
                or click to browse · PNG, JPG, WEBP · max 6 files
              </div>
            </div>

            {/* Upload Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <button onClick={() => imageInputRef.current?.click()} style={{
                padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)", color: "#fff", cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <span>🖼️</span> Upload Images
              </button>
              <button onClick={() => videoInputRef.current?.click()} style={{
                padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)", color: "#fff", cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <span>🎬</span> Upload Video
              </button>
            </div>

            {/* Hidden inputs */}
            <input ref={imageInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={e => handleFileSelect(e.target.files)} />
            <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }}
              onChange={e => handleFileSelect(e.target.files)} />

            {/* Media Preview Grid */}
            {mediaFiles.length > 0 && (
              <div>
                <label style={{ ...LABEL_STYLE, marginBottom: 12 }}>
                  Uploaded Media ({mediaFiles.length}/6)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {mediaFiles.map((file, i) => (
                    <div key={i} style={{
                      position: "relative", borderRadius: 12, overflow: "hidden",
                      aspectRatio: "1", background: "rgba(255,255,255,0.05)",
                      border: i === 0 ? `2px solid ${accentColor}` : "2px solid transparent",
                    }}>
                      {file.type === "image" ? (
                        <img src={file.url} alt={file.name} style={{
                          width: "100%", height: "100%", objectFit: "cover",
                        }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", position: "relative" }}>
                          <video src={file.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{
                            position: "absolute", inset: 0, display: "flex",
                            alignItems: "center", justifyContent: "center",
                            background: "rgba(0,0,0,0.4)",
                          }}>
                            <span style={{ fontSize: 24 }}>▶</span>
                          </div>
                        </div>
                      )}
                      {/* Cover badge */}
                      {i === 0 && (
                        <div style={{
                          position: "absolute", top: 6, left: 6,
                          background: accentColor, color: "#fff",
                          fontSize: 9, fontWeight: 700, padding: "2px 7px",
                          borderRadius: 20, fontFamily: "'DM Sans', sans-serif",
                        }}>COVER</div>
                      )}
                      {/* Remove button */}
                      <button onClick={() => removeMedia(i)} style={{
                        position: "absolute", top: 6, right: 6,
                        width: 22, height: 22, borderRadius: "50%",
                        background: "rgba(0,0,0,0.7)", border: "none",
                        color: "#fff", cursor: "pointer", fontSize: 11,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>✕</button>
                    </div>
                  ))}
                  {/* Add more slot */}
                  {mediaFiles.length < 6 && (
                    <div onClick={() => imageInputRef.current?.click()} style={{
                      borderRadius: 12, aspectRatio: "1",
                      border: "2px dashed rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "rgba(255,255,255,0.2)", fontSize: 24,
                      background: "rgba(255,255,255,0.02)",
                    }}>+</div>
                  )}
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", marginTop: 10 }}>
                  First image/video is used as the cover in the activity feed
                </p>
              </div>
            )}

            {mediaFiles.length === 0 && (
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif", textAlign: "center", marginTop: 8 }}>
                No media added yet — you can skip this step
              </p>
            )}
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex", gap: 10, flexShrink: 0,
        background: "#0d0d12",
      }}>
        {step === 1 ? (
          <>
            <button onClick={onBack} style={{
              flex: 1, padding: "14px", borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "rgba(255,255,255,0.5)",
              fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>Cancel</button>
            <button onClick={() => setStep(2)} disabled={!canProceed} style={{
              flex: 2, padding: "14px", borderRadius: 50, border: "none",
              background: canProceed ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` : "rgba(255,255,255,0.07)",
              color: canProceed ? "#fff" : "rgba(255,255,255,0.25)",
              fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              cursor: canProceed ? "pointer" : "not-allowed",
            }}>
              Next: Add Media →
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setStep(1)} style={{
              flex: 1, padding: "14px", borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "rgba(255,255,255,0.5)",
              fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>← Back</button>
            <button onClick={handleCreate} style={{
              flex: 2, padding: "14px", borderRadius: 50, border: "none",
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              color: "#fff", fontSize: 14, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              boxShadow: `0 4px 16px ${accentColor}44`,
            }}>
              {mediaFiles.length > 0 ? `🚀 Create with ${mediaFiles.length} media file${mediaFiles.length > 1 ? "s" : ""}` : "Create Activity →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
