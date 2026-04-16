/**
 * useNearby hook
 *
 * Fetches nearby users and activities within 10 km radius from the backend.
 * Uses real data from database only – no fallback to demo data.
 */

import { useState, useEffect } from 'react';
import api from '../api/api';

export function useNearby(coords) {
  const [nearbyUsers,      setNearbyUsers]      = useState([]);
  const [nearbyActivities, setNearbyActivities] = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState(null);

  useEffect(() => {
    if (!coords) return;

    const fetchNearby = async () => {
      setLoading(true);
      setError(null);
      const { latitude, longitude } = coords;

      try {
        const [usersRes, activitiesRes] = await Promise.all([
          api.get(`/api/location/nearby-users?lat=${latitude}&lon=${longitude}`),
          api.get(`/api/location/nearby-activities?lat=${latitude}&lon=${longitude}`),
        ]);

        const users      = usersRes.data.users      || [];
        const activities = activitiesRes.data.activities || [];

        setNearbyUsers(users);
        setNearbyActivities(activities);
      } catch (err) {
        console.error('[useNearby] Failed to fetch nearby data:', err.message);
        setError(err.message);
        setNearbyUsers([]);
        setNearbyActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [coords?.latitude, coords?.longitude]);

  return { nearbyUsers, nearbyActivities, loading, error };
}
