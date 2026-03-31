import Avatar from "./Avatar";

export default function AvatarStack({ attendees, maxVisible = 5 }) {
  const visible = attendees.slice(0, maxVisible);
  const extra = attendees.length - maxVisible;

  return (
    <div style={{ display: "flex", marginLeft: -4 }}>
      {visible.map((initials, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i }}>
          <Avatar initials={initials} size={24} />
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            marginLeft: -8,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: "rgba(255,255,255,0.6)",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
