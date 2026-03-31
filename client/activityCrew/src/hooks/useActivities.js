/* ═══════════════════════════════════════════════════════════════════
   useActivities Hook
   ─────────────────────────────────────────────────────────────────
   Manages all activity data by connecting to the real backend API.
   
   Features:
   - Fetches all activities from GET /api/activities on mount
   - Tracks which activities the logged-in user has joined
   - addActivity  → POST /api/activities (creates on server)
   - joinActivity → POST /api/activities/:id/join
   - leaveActivity → DELETE /api/activities/:id/leave
   - Computes hostedActivities and joinedActivities from server data
   ═══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

export function useActivities() {
  const [activities, setActivities]       = useState([]);
  const [joinedIdsList, setJoinedIdsList] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  /* Build a Set for O(1) membership checks */
  const joinedIds = new Set(joinedIdsList);

  /* ── Fetch all activities from backend ──────────────────────────── */
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/activities');

      /* Normalize: ensure attendees/tags/joined are arrays */
      const normalized = data.map(a => ({
        ...a,
        attendees: a.attendees || [],
        tags:      a.tags      || [],
        joined:    a.joined    || [],
      }));

      setActivities(normalized);

      /* Determine which ones current user has joined (userId from localStorage) */
      const userId = (() => {
        try { return JSON.parse(localStorage.getItem('user'))?.id; } catch { return null; }
      })();
      if (userId) {
        const myJoined = normalized
          .filter(a => Array.isArray(a.joined) && a.joined.includes(userId))
          .map(a => a.id);
        setJoinedIdsList(myJoined);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  /* ── Create a new activity ──────────────────────────────────────── */
  const addActivity = async (formData) => {
    try {
      const payload = {
        title:       formData.title,
        description: formData.description || '',
        category:    formData.category,
        location:    formData.location,
        time:        formData.date && formData.time
          ? new Date(`${formData.date}T${formData.time}`).toISOString()
          : new Date().toISOString(),
        max:         parseInt(formData.max) || 8,
        tags:        formData.tags || [formData.category, formData.activityType].filter(Boolean),
        color:       formData.color || '#FF6B35',
        latitude:    formData.latitude  || null,
        longitude:   formData.longitude || null,
      };

      const { data } = await api.post('/api/activities', payload);
      const newActivity = {
        ...data.activity,
        attendees: data.activity.attendees || [],
        tags:      data.activity.tags      || [],
        joined:    data.activity.joined    || [],
        /* pass through media/cover from form so UI shows it immediately */
        media:       formData.media       || [],
        coverImage:  formData.coverImage  || null,
        coverVideo:  formData.coverVideo  || null,
      };

      setActivities(prev => [newActivity, ...prev]);
      setJoinedIdsList(prev => [...prev, newActivity.id]);
      return newActivity;
    } catch (err) {
      console.error('Failed to create activity:', err);
      throw err;
    }
  };

  /* ── Join an existing activity ──────────────────────────────────── */
  const joinActivity = async (activityId) => {
    if (joinedIds.has(activityId)) return; // already joined, skip

    /* Optimistic UI update */
    setJoinedIdsList(prev => [...prev, activityId]);
    setActivities(prev => prev.map(a =>
      a.id === activityId
        ? { ...a, joined: [...(a.joined || []), 'me'] }
        : a
    ));

    try {
      const { data } = await api.post(`/api/activities/${activityId}/join`);
      /* Replace optimistic entry with real server data */
      setActivities(prev => prev.map(a =>
        a.id === activityId ? { ...data.activity, attendees: data.activity.attendees || [], tags: data.activity.tags || [] } : a
      ));
    } catch (err) {
      /* Roll back optimistic update on failure */
      setJoinedIdsList(prev => prev.filter(id => id !== activityId));
      setActivities(prev => prev.map(a =>
        a.id === activityId
          ? { ...a, joined: (a.joined || []).slice(0, -1) }
          : a
      ));
      throw err;
    }
  };

  /* ── Leave an activity ──────────────────────────────────────────── */
  const leaveActivity = async (activityId) => {
    setJoinedIdsList(prev => prev.filter(id => id !== activityId));
    try {
      await api.delete(`/api/activities/${activityId}/leave`);
      await fetchActivities(); // refresh to sync server state
    } catch (err) {
      console.error('Failed to leave activity:', err);
    }
  };

  /* ── Derived lists for profile view ────────────────────────────── */
  const userId = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?.id; } catch { return null; }
  })();

  const hostedActivities = activities.filter(a => a.hostId === userId);
  const joinedActivities = activities.filter(a => joinedIds.has(a.id) && a.hostId !== userId);

  return {
    activities,
    loading,
    error,
    addActivity,
    joinActivity,
    leaveActivity,
    joinedIds,
    hostedActivities,
    joinedActivities,
    refetch: fetchActivities,
  };
}
