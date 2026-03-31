/**
 * Haversine Formula – calculate great-circle distance between two coordinates.
 *
 * Architecture note (startup best practice):
 *   Keep this pure utility separate from DB logic so it can be unit-tested
 *   and reused anywhere (controllers, scheduled jobs, websocket handlers).
 *
 * @param {number} lat1  - Origin latitude  (degrees)
 * @param {number} lon1  - Origin longitude (degrees)
 * @param {number} lat2  - Target latitude  (degrees)
 * @param {number} lon2  - Target longitude (degrees)
 * @returns {number}       Distance in kilometres
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
}

/**
 * Format a distance in km into a human-readable string.
 * < 1 km  → "850 m"
 * >= 1 km → "2.3 km"
 */
function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

module.exports = { haversineDistance, formatDistance };
