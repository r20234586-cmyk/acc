# Location-Based Discovery — Architecture & Best Practices

## System Overview

```
Browser (React)
  │
  ├─ useLocation hook   → navigator.geolocation.getCurrentPosition()
  │       │                POST /api/location/update  →  users.latitude, users.longitude
  │       ▼
  ├─ useNearby hook     → GET /api/location/nearby-users?lat=&lon=
  │                     → GET /api/location/nearby-activities?lat=&lon=
  │
  └─ UI components
       ├── DashboardView      → "Upcoming Near You"  +  "People Near You" (top 4 each)
       └── PeopleNearbyView   → full paginated list with filters


Express (Node.js)
  │
  ├─ POST /api/location/update         → saves lat/lon to users table
  ├─ GET  /api/location/nearby-users   → bounding-box pre-filter + Haversine precise filter
  └─ GET  /api/location/nearby-activities → same, future-dated only

PostgreSQL
  ├─ users.latitude / users.longitude   (FLOAT, nullable)
  └─ activities.latitude / activities.longitude (FLOAT, nullable)
```

---

## Distance Calculation — Haversine Formula

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
distance = 2R × atan2(√a, √(1−a))   where R = 6371 km
```

Implemented in: `server/utils/location/haversine.js`

**Two-phase filtering (performance pattern used at scale):**
1. **Bounding box** (SQL WHERE clause) — eliminates ~95% of rows cheaply.
   `lat BETWEEN (userLat - delta) AND (userLat + delta)` where delta = 10/111
2. **Haversine check** (Node.js) — precise great-circle filter on the small result set.

---

## Architecture Decisions & Startup Best Practices

### 1. Separation of Concerns
```
controllers/locationController.js   ← HTTP request/response only
utils/location/haversine.js         ← pure math, no DB, testable in isolation
models/User.js, Activity.js         ← schema only, no business logic
```

### 2. Graceful Degradation (UX)
- Location denied → fallback coords (city centre) → dummy data shown
- API offline → dummy data shown with "demo" badge
- User never sees a blank screen

### 3. Privacy Best Practices
- Coordinates stored server-side — never exposed in public API responses
- Browser permission dialog only shown once per session (sessionStorage cache)
- Location explained to user BEFORE the browser prompts (LocationPermissionBanner)
- `enableHighAccuracy: false` → faster, less battery, enough for 10 km radius

### 4. Performance at Scale
| Scale            | Strategy                                              |
|------------------|-------------------------------------------------------|
| < 100k users     | Bounding box SQL + Haversine in Node (current)        |
| 100k – 1M users  | Add PostGIS: `ST_DWithin(geom, ST_Point(lon,lat), 10000)` |
| > 1M users       | Geohash indexing (H3 library) or Redis GEOSEARCH       |

### 5. API Design
- `POST /api/location/update` — protected (auth required), idempotent
- `GET /api/location/nearby-*` — query params `lat` + `lon` (no body in GET)
- Distance injected at query time, not stored (avoids stale data)

### 6. Frontend Hooks Architecture
```
useLocation()   — one-time permission + DB sync
   ↓ coords
useNearby(coords) — fetches both users + activities in parallel (Promise.all)
   ↓ nearbyUsers, nearbyActivities
DashboardView / PeopleNearbyView — consume data, never call API directly
```

### 7. When to upgrade to PostGIS
Add `postgis` extension to Postgres and change the query to:
```sql
SELECT *, ST_Distance(
  ST_MakePoint(longitude, latitude)::geography,
  ST_MakePoint($userLon, $userLat)::geography
) / 1000 AS distance_km
FROM users
WHERE ST_DWithin(
  ST_MakePoint(longitude, latitude)::geography,
  ST_MakePoint($userLon, $userLat)::geography,
  10000  -- 10 km in metres
)
ORDER BY distance_km;
```
This uses a spatial GiST index and is 100x faster than the Node.js approach for large datasets.

---

## Files Changed / Created

### New Files
| File | Purpose |
|------|---------|
| `server/utils/location/haversine.js` | Pure Haversine distance formula |
| `server/controllers/locationController.js` | 3 location API endpoints |
| `server/routes/locationRoutes.js` | Express router for /api/location/* |
| `client/src/hooks/useLocation.js` | Browser geolocation + DB sync |
| `client/src/hooks/useNearby.js` | Fetch nearby users & activities |
| `client/src/components/ui/LocationPermissionBanner.jsx` | Permission UX |

### Modified Files
| File | Change |
|------|--------|
| `server/models/User.js` | Added `latitude`, `longitude` fields |
| `server/models/Activity.js` | Added `latitude`, `longitude` fields |
| `server/server.js` | Registered `/api/location` routes |
| `client/src/components/dashboard/DashboardView.jsx` | Real location data in both sections |
| `client/src/components/people/PeopleNearbyView.jsx` | Real location data + skeleton loading |
