/* ═══════════════════════════════════════════════════════════════════
   useConnections Hook — Connected to Real Backend
   ─────────────────────────────────────────────────────────────────
   GET /api/connections/requests  — incoming pending requests
   PUT /api/connections/:id/accept
   PUT /api/connections/:id/decline
   ═══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

export function useConnections() {
  const [requests,  setRequests]  = useState([]);
  const [connected, setConnected] = useState([]);
  const [loading,   setLoading]   = useState(true);

  /* ── Fetch pending requests ───────────────────────────────────── */
  const fetchRequests = useCallback(async () => {
    try {
      const [reqRes, connRes] = await Promise.all([
        api.get('/api/connections/requests'),
        api.get('/api/connections'),
      ]);
      setRequests(reqRes.data.requests  || []);
      setConnected(connRes.data.connections || []);
    } catch (err) {
      console.warn('[useConnections] fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  /* ── Accept a request ────────────────────────────────────────── */
  const accept = async (id) => {
    const req = requests.find(r => r.id === id);
    // Optimistic
    setRequests(rs => rs.filter(r => r.id !== id));
    if (req) setConnected(c => [...c, req]);
    try {
      await api.put(`/api/connections/${id}/accept`);
    } catch (err) {
      console.warn('[useConnections] accept failed:', err.message);
      fetchRequests(); // restore
    }
  };

  /* ── Decline a request ───────────────────────────────────────── */
  const decline = async (id) => {
    setRequests(rs => rs.filter(r => r.id !== id));
    try {
      await api.put(`/api/connections/${id}/decline`);
    } catch (err) {
      console.warn('[useConnections] decline failed:', err.message);
      fetchRequests();
    }
  };

  return {
    requests,
    connected,
    accept,
    decline,
    requestCount: requests.length,
    loading,
  };
}
