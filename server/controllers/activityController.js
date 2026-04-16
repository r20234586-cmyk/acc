/* ═══════════════════════════════════════════════════════════════════
   Activity Controller — CRUD + Join/Leave + Delete
   ═══════════════════════════════════════════════════════════════════ */
const { Op }   = require('sequelize');
const Activity = require('../models/Activity');
const User     = require('../models/User');
const Notification = require('../models/Notification');
const { createNotification } = require('./notificationController');
const { haversineDistance } = require('../utils/location/haversine');

const PROXIMITY_RADIUS_KM = 10;

/* POST /api/activities — create activity, host auto-joined */
const createActivity = async (req, res, next) => {
  try {
    const { title, description, category, location, time, max, tags, color, latitude, longitude } = req.body;
    const host = await User.findByPk(req.userId, { attributes: ['id', 'name'] });
    const nameParts = (host?.name || 'User').split(' ');
    const initials  = nameParts.length >= 2 ? nameParts[0][0] + nameParts[1][0] : (host?.name || 'US').slice(0, 2).toUpperCase();

    const activity = await Activity.create({
      title, description, category, location,
      latitude: latitude || null, longitude: longitude || null,
      time, max: max || 10, tags: tags || [], color: color || '#FF6B35',
      hostId: req.userId, hostAvatar: initials,
      joined: [req.userId], attendees: [initials],
    });

    // ── Notify nearby users (within 10 km) exactly once per activity ──
    if (latitude != null && longitude != null) {
      const delta = PROXIMITY_RADIUS_KM / 111; // 1 deg ≈ 111 km
      const candidates = await User.findAll({
        where: {
          id:        { [Op.ne]: req.userId },
          latitude:  { [Op.between]: [latitude - delta, latitude + delta] },
          longitude: { [Op.between]: [longitude - delta, longitude + delta] },
        },
        attributes: ['id', 'latitude', 'longitude'],
      });

      await Promise.all(
        candidates
          .filter(u => haversineDistance(latitude, longitude, u.latitude, u.longitude) <= PROXIMITY_RADIUS_KM)
          .map(async (u) => {
            // Dedup: skip if user already has a new_activity notif for this activity
            const existing = await Notification.findOne({
              where: { userId: u.id, type: 'new_activity', relatedActivityId: activity.id },
            });
            if (existing) return;
            await createNotification({
              userId:            u.id,
              type:              'new_activity',
              title:             'New activity nearby',
              message:           `${host?.name || 'Someone'} created "${title}" near you`,
              relatedUserId:     req.userId,
              relatedActivityId: activity.id,
            });
          })
      );
    }

    res.status(201).json({ message: 'Activity created successfully', activity });
  } catch (error) { next(error); }
};

/* GET /api/activities — list all (public) */
const getAllActivities = async (req, res, next) => {
  try {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago

    const activities = await Activity.findAll({
      where: {
        time: { [Op.gt]: threeHoursAgo }, // Only show activities scheduled within the last 3 hours
      },
      include: [{ model: User, as: 'host', attributes: ['id', 'name', 'profilePicture'] }],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(activities);
  } catch (error) { next(error); }
};

/* GET /api/activities/:id — single activity detail */
const getActivityById = async (req, res, next) => {
  try {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const activity = await Activity.findOne({
      where: {
        id: req.params.id,
        time: { [Op.gt]: threeHoursAgo }, // Only allow access if not expired
      },
      include: [{ model: User, as: 'host', attributes: ['id', 'name', 'profilePicture'] }],
    });
    if (!activity) return res.status(404).json({ message: 'Activity not found or expired' });
    res.status(200).json(activity);
  } catch (error) { next(error); }
};

/* POST /api/activities/:id/join — add user to joined[] */
const joinActivity = async (req, res, next) => {
  try {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const activity = await Activity.findOne({
      where: {
        id: req.params.id,
        time: { [Op.gt]: threeHoursAgo }, // Only allow joining if not expired
      },
    });
    if (!activity) return res.status(404).json({ message: 'Activity not found or expired' });
    if (activity.joined.includes(req.userId)) return res.status(400).json({ message: 'Already joined this activity' });
    if (activity.joined.length >= activity.max) return res.status(400).json({ message: 'Activity is full' });

    const user = await User.findByPk(req.userId, { attributes: ['name'] });
    const parts    = (user?.name || 'User').split(' ');
    const initials = parts.length >= 2 ? parts[0][0] + parts[1][0] : (user?.name || 'US').slice(0, 2).toUpperCase();

    await activity.update({
      joined:    [...activity.joined, req.userId],
      attendees: [...(activity.attendees || []), initials],
    });
    await activity.reload();

    // Notify the host that someone joined their activity
    if (activity.hostId !== req.userId) {
      await createNotification({
        userId:             activity.hostId,
        type:               'activity_update',
        title:              'New participant joined',
        message:            `${user?.name || 'Someone'} joined your activity: ${activity.title}`,
        relatedUserId:      req.userId,
        relatedActivityId:  activity.id,
      });
    }

    res.status(200).json({ message: 'Joined activity successfully', activity });
  } catch (error) { next(error); }
};

/* DELETE /api/activities/:id/leave — remove user from joined[] */
const leaveActivity = async (req, res, next) => {
  try {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const activity = await Activity.findOne({
      where: {
        id: req.params.id,
        time: { [Op.gt]: threeHoursAgo }, // Only allow leaving if not expired
      },
    });
    if (!activity) return res.status(404).json({ message: 'Activity not found or expired' });
    if (activity.hostId === req.userId) return res.status(400).json({ message: 'You are the host. Delete the activity instead of leaving.' });
    if (!activity.joined.includes(req.userId)) return res.status(400).json({ message: 'You have not joined this activity' });

    await activity.update({ joined: activity.joined.filter(id => id !== req.userId) });
    await activity.reload();
    res.status(200).json({ message: 'Left activity successfully', activity });
  } catch (error) { next(error); }
};

/* DELETE /api/activities/:id — host-only delete */
const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (activity.hostId !== req.userId) return res.status(403).json({ message: 'Only the host can delete this activity' });
    await activity.destroy();
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { createActivity, getAllActivities, getActivityById, joinActivity, leaveActivity, deleteActivity };
