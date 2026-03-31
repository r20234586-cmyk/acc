/**
 * useNearby hook
 *
 * Fetches nearby users and activities from the backend.
 * Falls back to rich dummy data when:
 *   • Coordinates aren't ready yet
 *   • Backend request fails (API not deployed / dev mode)
 *
 * Dummy data uses realistic Haversine-compatible lat/lon offsets
 * relative to the fallback Hyderabad centre point.
 */

import { useState, useEffect } from 'react';
import api from '../api/api';

// ── Dummy nearby users (simulate 10 km radius, Hyderabad) ────────────────
const DUMMY_USERS = [
  { id:'u1', name:'Arjun K.',   profilePicture:null, bio:'Plays badminton 3x a week. Looking for doubles partners.',  interests:['Badminton','Fitness'], rating:4.8, distance:'1.2 km', distanceKm:1.2,  latitude:17.3960, longitude:78.4910 },
  { id:'u2', name:'Meera D.',   profilePicture:null, bio:'Guitarist. Organises jam sessions every other weekend.',    interests:['Music','Social'],       rating:4.9, distance:'2.8 km', distanceKm:2.8,  latitude:17.4090, longitude:78.4750 },
  { id:'u3', name:'Ravi T.',    profilePicture:null, bio:'Marathon runner. Leads morning runs at KBR Park.',          interests:['Running','Fitness'],    rating:5.0, distance:'0.9 km', distanceKm:0.9,  latitude:17.3930, longitude:78.4820 },
  { id:'u4', name:'Priya S.',   profilePicture:null, bio:'GATE aspirant, enjoys group study sessions.',               interests:['Study','Tech'],         rating:4.7, distance:'3.1 km', distanceKm:3.1,  latitude:17.4130, longitude:78.4680 },
  { id:'u5', name:'Kiran M.',   profilePicture:null, bio:'Founder at early stage startup. Hosts monthly meetups.',   interests:['Startup','Social'],    rating:4.8, distance:'5.2 km', distanceKm:5.2,  latitude:17.4290, longitude:78.4560 },
  { id:'u6', name:'Shreya L.',  profilePicture:null, bio:'Board game enthusiast. Regulars at Dice & Brew.',          interests:['Gaming','Social'],      rating:4.6, distance:'1.7 km', distanceKm:1.7,  latitude:17.4010, longitude:78.4780 },
  { id:'u7', name:'Vikram P.',  profilePicture:null, bio:'CrossFit trainer by day, badminton player by evening.',    interests:['Fitness','Sports'],     rating:4.9, distance:'4.0 km', distanceKm:4.0,  latitude:17.4220, longitude:78.4640 },
  { id:'u8', name:'Ananya T.',  profilePicture:null, bio:'Yoga instructor + singer. Hosts sunrise yoga sessions.',   interests:['Music','Fitness'],      rating:5.0, distance:'1.5 km', distanceKm:1.5,  latitude:17.3990, longitude:78.4790 },
];

// ── Dummy nearby activities ───────────────────────────────────────────────
const now = new Date();
const future = (days, hour, min = 0) => {
  const d = new Date(now); d.setDate(d.getDate() + days);
  d.setHours(hour, min, 0, 0); return d.toISOString();
};

const DUMMY_ACTIVITIES = [
  {
    id:'a1', title:'Badminton Doubles',        category:'sports',  color:'#FF6B35',
    time: future(1, 6),  location:'YMCA Court 3',             distance:'1.2 km', distanceKm:1.2,
    joined:3, max:5,  host:{ name:'Arjun K.' },
    latitude:17.3960, longitude:78.4910,
  },
  {
    id:'a2', title:'Jam Session – Guitar',     category:'music',   color:'#A78BFA',
    time: future(3, 17), location:'Studio 7, Banjara Hills',   distance:'3.4 km', distanceKm:3.4,
    joined:4, max:6,  host:{ name:'Meera D.' },
    latitude:17.4090, longitude:78.4750,
  },
  {
    id:'a3', title:'GATE CS Study Group',      category:'study',   color:'#34D399',
    time: future(2, 10), location:'Starbucks, Jubilee Hills',  distance:'0.8 km', distanceKm:0.8,
    joined:5, max:8,  host:{ name:'Priya S.' },
    latitude:17.3880, longitude:78.4840,
  },
  {
    id:'a4', title:'Morning Run – 5K',         category:'fitness', color:'#F472B6',
    time: future(1, 6,30), location:'KBR Park Entrance',       distance:'2.1 km', distanceKm:2.1,
    joined:7, max:10, host:{ name:'Ravi T.' },
    latitude:17.4040, longitude:78.4920,
  },
  {
    id:'a5', title:'Board Game Night',         category:'gaming',  color:'#60A5FA',
    time: future(4, 19), location:'Dice & Brew Café',          distance:'4.5 km', distanceKm:4.5,
    joined:4, max:8,  host:{ name:'Shreya L.' },
    latitude:17.4180, longitude:78.4600,
  },
  {
    id:'a6', title:'Startup Founders Meetup',  category:'social',  color:'#FBBF24',
    time: future(2, 18), location:'T-Hub, IIIT Campus',        distance:'5.2 km', distanceKm:5.2,
    joined:12, max:20, host:{ name:'Kiran M.' },
    latitude:17.4250, longitude:78.4540,
  },
];

export function useNearby(coords) {
  const [nearbyUsers,      setNearbyUsers]      = useState([]);
  const [nearbyActivities, setNearbyActivities] = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [usingDummy, setUsingDummy]             = useState(false);

  useEffect(() => {
    if (!coords) return;

    const fetchNearby = async () => {
      setLoading(true);
      const { latitude, longitude } = coords;

      try {
        const [usersRes, activitiesRes] = await Promise.all([
          api.get(`/api/location/nearby-users?lat=${latitude}&lon=${longitude}`),
          api.get(`/api/location/nearby-activities?lat=${latitude}&lon=${longitude}`),
        ]);

        const users      = usersRes.data.users      || [];
        const activities = activitiesRes.data.activities || [];

        // If backend returns empty (fresh DB), supplement with dummy data
        setNearbyUsers(users.length      > 0 ? users      : DUMMY_USERS);
        setNearbyActivities(activities.length > 0 ? activities : DUMMY_ACTIVITIES);
        setUsingDummy(users.length === 0 || activities.length === 0);
      } catch (err) {
        console.warn('[useNearby] API unavailable – using dummy data:', err.message);
        setNearbyUsers(DUMMY_USERS);
        setNearbyActivities(DUMMY_ACTIVITIES);
        setUsingDummy(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [coords?.latitude, coords?.longitude]);

  return { nearbyUsers, nearbyActivities, loading, usingDummy };
}
