/* ═══════════════════════════════════════════════════════════════════
   useChat Hook — Group Messaging with Polling
   ─────────────────────────────────────────────────────────────────
   Provides real-time-like group chat for an activity.
   
   Architecture: REST polling (every 3 seconds) instead of WebSockets.
   This works without additional server infrastructure while feeling
   nearly real-time for small groups.
   
   Features:
   - Loads full message history on mount
   - Polls for new messages every 3s using the /poll endpoint
   - sendMessage → POST /api/chat/:activityId/messages
   - Optimistic UI: message appears instantly before server confirms
   - Merges poll results without duplicates (tracked by message ID)
   ═══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/api";

export function useChat(activityId, isJoined) {
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState(null);

  /* Track the timestamp of the last received message for polling */
  const lastMessageTime = useRef(null);
  const pollInterval    = useRef(null);
  const seenIds         = useRef(new Set()); // deduplication set

  /* ── Merge new messages without duplicates ──────────────────────── */
  const mergeMessages = useCallback((newMsgs) => {
    const fresh = newMsgs.filter(m => !seenIds.current.has(m.id));
    if (fresh.length === 0) return;
    fresh.forEach(m => seenIds.current.add(m.id));
    setMessages(prev => {
      const combined = [...prev, ...fresh];
      /* Sort by createdAt to maintain chronological order */
      combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      /* Update last message timestamp for next poll */
      if (combined.length > 0) {
        lastMessageTime.current = combined[combined.length - 1].createdAt;
      }
      return combined;
    });
  }, []);

  /* ── Load initial message history ───────────────────────────────── */
  const loadMessages = useCallback(async () => {
    if (!activityId || !isJoined) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/api/chat/${activityId}/messages`);
      const msgs = data.messages || [];
      seenIds.current = new Set(msgs.map(m => m.id));
      setMessages(msgs);
      if (msgs.length > 0) {
        lastMessageTime.current = msgs[msgs.length - 1].createdAt;
      }
    } catch (err) {
      /* If 403 (not joined), show empty state — not an error */
      if (err.response?.status === 403) {
        setMessages([]);
      } else {
        setError('Failed to load messages');
        console.error('Chat load error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [activityId, isJoined]);

  /* ── Poll for new messages since last fetch ─────────────────────── */
  const pollForNew = useCallback(async () => {
    if (!activityId || !isJoined) return;
    try {
      const since = lastMessageTime.current;
      const url   = since
        ? `/api/chat/${activityId}/poll?since=${encodeURIComponent(since)}`
        : `/api/chat/${activityId}/poll`;
      const { data } = await api.get(url);
      if (data.messages?.length > 0) {
        mergeMessages(data.messages);
      }
    } catch (err) {
      /* Silently ignore poll errors — will retry on next interval */
      if (err.response?.status !== 403) {
        console.warn('Chat poll error:', err.message);
      }
    }
  }, [activityId, isJoined, mergeMessages]);

  /* ── Load on mount, start polling when joined ───────────────────── */
  useEffect(() => {
    if (!activityId || !isJoined) {
      setLoading(false);
      return;
    }

    loadMessages();

    /* Start polling every 3 seconds */
    pollInterval.current = setInterval(pollForNew, 3000);

    return () => {
      /* Clean up interval when component unmounts or activity changes */
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [activityId, isJoined, loadMessages, pollForNew]);

  /* ── Send a new message ─────────────────────────────────────────── */
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || sending) return;

    /* Build optimistic message for immediate display */
    const user         = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
    const nameParts    = (user?.name || 'You').split(' ');
    const initials     = nameParts.length >= 2 ? nameParts[0][0] + nameParts[1][0] : 'ME';
    const tempId       = `temp-${Date.now()}`;
    const optimistic   = {
      id:           tempId,
      activityId,
      senderId:     user?.id || 'me',
      senderName:   user?.name || 'You',
      senderAvatar: initials,
      text:         text.trim(),
      createdAt:    new Date().toISOString(),
      isMine:       true,
      pending:      true, // visual indicator while sending
    };

    /* Show optimistic message immediately */
    seenIds.current.add(tempId);
    setMessages(prev => [...prev, optimistic]);

    setSending(true);
    try {
      const { data } = await api.post(`/api/chat/${activityId}/messages`, { text: text.trim() });
      const real = { ...data.message, isMine: true };

      /* Replace temp message with real one from server */
      seenIds.current.delete(tempId);
      seenIds.current.add(real.id);
      setMessages(prev => prev.map(m => m.id === tempId ? real : m));
      lastMessageTime.current = real.createdAt;
    } catch (err) {
      /* Remove failed message and show error state */
      seenIds.current.delete(tempId);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setError('Failed to send message');
      throw err;
    } finally {
      setSending(false);
    }
  }, [activityId, sending]);

  /* ── Delete a message ───────────────────────────────────────────── */
  const deleteMessage = useCallback(async (messageId) => {
    /* Optimistic removal */
    setMessages(prev => prev.filter(m => m.id !== messageId));
    try {
      await api.delete(`/api/chat/${activityId}/messages/${messageId}`);
    } catch (err) {
      console.error('Failed to delete message:', err);
      /* Re-fetch to restore if delete failed */
      loadMessages();
    }
  }, [activityId, loadMessages]);

  return { messages, loading, sending, error, sendMessage, deleteMessage };
}
