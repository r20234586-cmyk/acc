/* ═══════════════════════════════════════════════════════════════════
   ChatView — Group Messaging for Activity Participants
   Polls backend every 3s for real-time feel without WebSockets.
   Gate: only joined members can send/read messages.
   ═══════════════════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import { CATEGORIES } from "../../data/constants";
import { useChat } from "../../hooks/useChat";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import BackButton from "../ui/BackButton";
import styles from "./ChatView.module.css";

export default function ChatView({ activity, onBack, isJoined = false }) {
  const bottomRef = useRef(null);
  const { messages, loading, sending, sendMessage, deleteMessage } = useChat(activity?.id, isJoined);

  /* Auto-scroll to newest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const category    = CATEGORIES.find((c) => c.id === activity.category);
  const memberCount = Array.isArray(activity.joined) ? activity.joined.length : (activity.joined ?? 0);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <BackButton onBack={onBack} />
        <div className={styles.activityIcon} style={{ background: `linear-gradient(135deg, ${activity.color}, ${activity.color}66)` }}>
          {category?.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.activityTitle}>{activity.title}</div>
          <div className={styles.memberCount}>{memberCount} members</div>
        </div>
        {/* Live indicator dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: isJoined ? '#34D399' : 'rgba(255,255,255,0.2)', boxShadow: isJoined ? '0 0 6px #34D399' : 'none' }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}>
            {isJoined ? 'live' : 'join to chat'}
          </span>
        </div>
      </div>

      {/* Gate: must join to chat */}
      {!isJoined ? (
        <div className={styles.notJoined}>
          <div className={styles.notJoinedIcon}>🔒</div>
          <div className={styles.notJoinedTitle}>Join to Chat</div>
          <div className={styles.notJoinedText}>Join this activity to participate in the group chat with other members.</div>
        </div>
      ) : loading ? (
        <div className={styles.loading}><span style={{ fontSize: 16 }}>⟳</span> Loading messages…</div>
      ) : (
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.emptyChat}>
              <div className={styles.emptyChatIcon}>💬</div>
              <div style={{ fontWeight: 700, color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: 15 }}>No messages yet</div>
              <div>Be the first to say something!</div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} accentColor={activity.color} onDelete={deleteMessage} />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {isJoined && <ChatInput onSend={sendMessage} accentColor={activity.color} disabled={sending} />}
    </div>
  );
}
