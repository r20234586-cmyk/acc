/* ═══════════════════════════════════════════════════════════════════
   ChatBubble — Individual message in the group chat.
   Shows sender name for others, right-aligns own messages.
   Pending messages (optimistic) shown slightly dimmed.
   Sender can delete their own messages via hover button.
   ═══════════════════════════════════════════════════════════════════ */
import Avatar from "../ui/Avatar";
import styles from "./ChatBubble.module.css";

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return d.toLocaleDateString();
}

export default function ChatBubble({ message, accentColor, onDelete }) {
  const { id, senderName, senderAvatar, text, createdAt, isMine, pending } = message;

  return (
    <div className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleTheirs}`}>
      {/* Avatar (only for others' messages) */}
      {!isMine && <Avatar initials={senderAvatar || '??'} size={30} />}

      <div className={styles.content}>
        {/* Sender name label */}
        {!isMine && <div className={styles.senderName}>{senderName}</div>}

        {/* Message bubble */}
        <div
          className={`${styles.text} ${isMine ? styles.textMine : styles.textTheirs} ${pending ? styles.textPending : ''}`}
          style={isMine ? { background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` } : {}}
        >
          {text}
        </div>

        {/* Timestamp row + delete button */}
        <div className={`${styles.timestamp} ${isMine ? styles.timestampMine : styles.timestampTheirs}`}>
          {pending && <span style={{ fontSize: 9 }}>⟳</span>}
          <span>{formatTime(createdAt)}</span>
          {isMine && !pending && onDelete && (
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(id)}
              title="Delete message"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
