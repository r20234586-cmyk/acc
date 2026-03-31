/* ═══════════════════════════════════════════════════════════════════
   Notification Controller
   ─────────────────────────────────────────────────────────────────
   Handles fetching, marking read, and creating notifications.
   Notifications are created automatically when:
     - A user joins an activity  → host gets a "join" notification
     - Activity is within 24h   → participants get a "reminder" (via cron/trigger)
   ═══════════════════════════════════════════════════════════════════ */

const Notification = require('../models/Notification');
const User         = require('../models/User');
const Activity     = require('../models/Activity');
const { Op }       = require('sequelize');

/* ── GET /api/notifications — list current user's notifications ──── */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    // Enrich with related user/activity data
    const enriched = await Promise.all(notifications.map(async (n) => {
      let relatedUser    = null;
      let relatedActivity = null;

      if (n.relatedUserId) {
        const u = await User.findByPk(n.relatedUserId, { attributes: ['id', 'name', 'profilePicture'] });
        if (u) {
          const parts = u.name.split(' ');
          relatedUser = {
            id:       u.id,
            name:     u.name,
            initials: parts.length >= 2 ? parts[0][0] + parts[1][0] : u.name.slice(0, 2).toUpperCase(),
          };
        }
      }

      if (n.relatedActivityId) {
        const a = await Activity.findByPk(n.relatedActivityId, { attributes: ['id', 'title', 'color'] });
        if (a) relatedActivity = { id: a.id, title: a.title, color: a.color };
      }

      return {
        id:              n.id,
        type:            n.type,
        title:           n.title,
        message:         n.message,
        read:            n.read,
        createdAt:       n.createdAt,
        relatedUser,
        relatedActivity,
      };
    }));

    const unreadCount = enriched.filter(n => !n.read).length;
    res.status(200).json({ notifications: enriched, unreadCount });
  } catch (error) {
    next(error);
  }
};

/* ── PUT /api/notifications/:id/read — mark one notification read ── */
const markRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOne({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!notif) return res.status(404).json({ message: 'Notification not found' });

    await notif.update({ read: true });
    res.status(200).json({ message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

/* ── PUT /api/notifications/read-all — mark all notifications read ─ */
const markAllRead = async (req, res, next) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.userId, read: false } }
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

/* ── Utility: create a notification (called internally) ─────────── */
const createNotification = async ({ userId, type, title, message, relatedUserId, relatedActivityId }) => {
  try {
    await Notification.create({ userId, type, title, message, relatedUserId, relatedActivityId });
  } catch (err) {
    console.error('[Notification] Failed to create:', err.message);
  }
};

module.exports = { getNotifications, markRead, markAllRead, createNotification };
