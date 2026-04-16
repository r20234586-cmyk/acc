const { Op } = require('sequelize');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { haversineDistance, formatDistance } = require('../utils/location/haversine');

const RADIUS_KM = 10;

// ─────────────────────────────────────────────
// POST /api/location/update
// Save / update the authenticated user's coordinates
// ─────────────────────────────────────────────
const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: 'latitude and longitude are required' });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    await User.update(
      { latitude, longitude },
      { where: { id: req.userId } }
    );

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// GET /api/location/nearby-users?lat=&lon=
// Return users within RADIUS_KM of the caller.
// Architecture: We pull all users with coordinates from Postgres (index on
// lat/lon helps at scale; for production use PostGIS ST_DWithin).
// Haversine filter runs in Node – acceptable for <100k users; swap to PostGIS
// spatial query when the table grows.
// ─────────────────────────────────────────────
const getNearbyUsers = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ message: 'lat and lon query params required' });
    }

    // Bounding box pre-filter to reduce rows scanned (1 degree ≈ 111 km)
    const delta = RADIUS_KM / 111;
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: req.userId },         // exclude self
        latitude:  { [Op.between]: [lat - delta, lat + delta] },
        longitude: { [Op.between]: [lon - delta, lon + delta] },
      },
      attributes: ['id', 'name', 'profilePicture', 'bio', 'interests', 'rating', 'latitude', 'longitude'],
    });

    // Precise Haversine filter + distance annotation
    const nearby = users
      .map((u) => {
        const km = haversineDistance(lat, lon, u.latitude, u.longitude);
        return { ...u.toJSON(), distanceKm: km, distance: formatDistance(km) };
      })
      .filter((u) => u.distanceKm <= RADIUS_KM)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.status(200).json({ users: nearby, count: nearby.length });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// GET /api/location/nearby-activities?lat=&lon=
// Return activities within RADIUS_KM – future-dated only
// ─────────────────────────────────────────────
const getNearbyActivities = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    // If coordinates invalid, fallback to all future activities (no distance filtering)
    if (isNaN(lat) || isNaN(lon)) {
      const activities = await Activity.findAll({
        where: {
          time: { [Op.gte]: new Date() }, // only future activities
        },
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'profilePicture'],
          },
        ],
        order: [['time', 'ASC']],
      });
      return res.status(200).json({ activities: activities.map(a => a.toJSON()), count: activities.length });
    }

    const delta = RADIUS_KM / 111;
    const activities = await Activity.findAll({
      where: {
        [Op.or]: [
          // Activities with coordinates within range
          {
            [Op.and]: [
              { latitude: { [Op.ne]: null } },
              { longitude: { [Op.ne]: null } },
              { latitude: { [Op.between]: [lat - delta, lat + delta] } },
              { longitude: { [Op.between]: [lon - delta, lon + delta] } },
            ]
          },
          // Activities without coordinates (show them too, but without distance)
          {
            [Op.and]: [
              { latitude: null },
              { longitude: null },
            ]
          }
        ],
        time: { [Op.gte]: new Date() }, // only future activities
      },
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'name', 'profilePicture'],
        },
      ],
      order: [['time', 'ASC']],
    });

    const nearby = activities
      .map((a) => {
        // Calculate distance only for activities with coordinates
        if (a.latitude !== null && a.longitude !== null) {
          const km = haversineDistance(lat, lon, a.latitude, a.longitude);
          return { ...a.toJSON(), distanceKm: km, distance: formatDistance(km) };
        } else {
          // Activities without coordinates get a high distance so they appear last
          return { ...a.toJSON(), distanceKm: 999, distance: 'Anywhere' };
        }
      })
      .filter((a) => a.distanceKm <= RADIUS_KM || a.distanceKm === 999) // Include activities without coordinates
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.status(200).json({ activities: nearby, count: nearby.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateLocation, getNearbyUsers, getNearbyActivities };
