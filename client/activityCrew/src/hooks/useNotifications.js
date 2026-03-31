/* ═══════════════════════════════════════════════════════════════════
   useNotifications Hook — Connected to Real Backend
   ─────────────────────────────────────────────────────────────────
   Fetches from GET /api/notifications, polls every 30s for new ones.
   markRead    → PUT /api/notifications/:id/read
   markAllRead → PUT /api/notifications/read-all
   ═══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(true);

  /* ── Fetch all notifications ──────────────────────────────────── */
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/api/notifications');
      const raw = data.notifications || [];

      // Normalise to shape the NotificationsView expects
      const normalised = raw.map(n => ({
        id:            n.id,
        type:          mapType(n.type),
        read:          n.read,
        time:          formatTime(n.createdAt),
        avatar:        n.relatedUser?.initials || null,
        name:          n.relatedUser?.name || 'Activity Crew',
        text:          n.message || n.title || '',
        activityColor: n.relatedActivity?.color || '#FF6B35',
      }));

      setNotifications(normalised);
      setUnreadCount(data.unreadCount ?? normalised.filter(n => !n.read).length);
    } catch (err) {
      console.warn('[useNotifications] fetch failed:', err.message);
      // Keep empty state on error — don't crash the UI
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Load on mount + poll every 30 seconds ───────────────────── */
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  /* ── Mark one notification read ──────────────────────────────── */
  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await api.put(`/api/notifications/${id}/read`);
    } catch (err) {
      console.warn('[useNotifications] markRead failed:', err.message);
      fetchNotifications();
    }
  };

  /* ── Mark all notifications read ────────────────────────────── */
  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await api.put('/api/notifications/read-all');
    } catch (err) {
      console.warn('[useNotifications] markAllRead failed:', err.message);
      fetchNotifications();
    }
  };

  return { notifications, unreadCount, markAllRead, markRead, loading };
}

/* ── Helpers ─────────────────────────────────────────────────── */

function mapType(type) {
  switch (type) {
    case 'connection_request': return 'request';
    case 'activity_update':   return 'join';
    case 'activity_reminder': return 'reminder';
    case 'new_activity':      return 'join';
    default:                  return 'reminder';
  }
}

function formatTime(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
