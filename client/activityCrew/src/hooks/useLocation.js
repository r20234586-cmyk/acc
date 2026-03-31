/**
 * useLocation hook
 *
 * Architecture:
 *   1. Request browser Geolocation on mount (once per session).
 *   2. On success → POST coordinates to /api/location/update (persists to DB).
 *   3. Expose coords + status so components can fetch nearby data.
 *
 * Best practices used:
 *   - Prompt is shown naturally on first meaningful interaction (not aggressively).
 *   - Graceful degradation: if denied/unavailable, fall back to dummy coords.
 *   - coords are cached in sessionStorage so the browser doesn't re-prompt
 *     every page reload within the same tab session.
 */

import { useState, useEffect } from 'react';
import api from '../api/api';

// Fallback dummy coordinates (Hyderabad city centre) – used when:
//   • user denies permission, OR
//   • browser doesn't support geolocation, OR
//   • backend APIs aren't ready yet (simulates nearby data)
const FALLBACK_COORDS = { latitude: 17.3850, longitude: 78.4867 };

export function useLocation() {
  const [coords, setCoords]   = useState(null);   // { latitude, longitude }
  const [status, setStatus]   = useState('idle');  // idle | requesting | granted | denied | error
  const [error, setError]     = useState(null);

  useEffect(() => {
    // Check sessionStorage first – avoid re-prompting in same session
    const cached = sessionStorage.getItem('userCoords');
    if (cached) {
      setCoords(JSON.parse(cached));
      setStatus('granted');
      return;
    }

    if (!navigator.geolocation) {
      console.warn('[Location] Geolocation not supported – using fallback');
      setCoords(FALLBACK_COORDS);
      setStatus('error');
      return;
    }

    setStatus('requesting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { latitude, longitude };

        setCoords(newCoords);
        setStatus('granted');
        sessionStorage.setItem('userCoords', JSON.stringify(newCoords));

        // Persist to DB (fire-and-forget; non-blocking)
        try {
          await api.post('/api/location/update', newCoords);
        } catch (err) {
          // Not fatal – user can still see nearby data via query params
          console.warn('[Location] Failed to persist coords to server:', err.message);
        }
      },
      (err) => {
        console.warn('[Location] Permission denied or error:', err.message);
        setError(err.message);
        setStatus('denied');
        // Graceful fallback so the UI still shows something useful
        setCoords(FALLBACK_COORDS);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 }
    );
  }, []);

  return { coords, status, error, isReady: coords !== null };
}
