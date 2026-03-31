/* ═══════════════════════════════════════════════════════════════════
   ChatInput — Message composer bar.
   Supports Enter to send, Shift+Enter for newline.
   Auto-expands textarea up to 3 lines.
   Shows send button with activity accent colour.
   ═══════════════════════════════════════════════════════════════════ */
import { useState, useRef } from "react";
import styles from "./ChatInput.module.css";

export default function ChatInput({ onSend, accentColor, disabled = false }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    setInput("");
    /* Reset textarea height */
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    try { await onSend(trimmed); } catch { /* error handled in hook */ }
  };

  const handleKeyDown = (e) => {
    /* Enter = send, Shift+Enter = newline */
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    /* Auto-expand textarea */
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

  const canSend = input.trim().length > 0 && !disabled;

  return (
    <div className={styles.container}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Message the group…"
        rows={1}
        className={styles.input}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={styles.sendBtn}
        style={{ background: canSend ? accentColor : 'rgba(255,255,255,0.1)' }}
        title="Send message"
      >
        {/* Up-arrow SVG icon — visible on dark background */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5 12 12 5 19 12"/>
        </svg>
      </button>
    </div>
  );
}
