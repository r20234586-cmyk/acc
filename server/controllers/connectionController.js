/* ═══════════════════════════════════════════════════════════════════
   Connections Controller
   ─────────────────────────────────────────────────────────────────
   Handles sending, accepting, declining, and listing connections.
   ═══════════════════════════════════════════════════════════════════ */

const Connection  = require('../models/Connection');
const User        = require('../models/User');
const { Op }      = require('sequelize');
const { createNotification } = require('./notificationController');

/* ── GET /api/connections/requests — incoming pending requests ────── */
const getRequests = async (req, res, next) => {
  try {
    const requests = await Connection.findAll({
      where: { recipientId: req.userId, status: 'pending' },
      order: [['createdAt', 'DESC']],
    });

    const enriched = await Promise.all(requests.map(async (r) => {
      const requester = await User.findByPk(r.requesterId, {
        attributes: ['id', 'name', 'profilePicture', 'bio', 'interests', 'location'],
      });
      if (!requester) return null;
      const parts = requester.name.split(' ');
      return {
        id:       r.id,
        initials: parts.length >= 2 ? parts[0][0] + parts[1][0] : requester.name.slice(0, 2).toUpperCase(),
        name:     requester.name,
        userId:   requester.id,
        bio:      requester.bio,
        interests: requester.interests,
        location: requester.location,
        activity: r.activityContext,
        time:     formatTime(r.createdAt),
      };
    }));

    res.status(200).json({ requests: enriched.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

/* ── GET /api/connections — accepted connections ──────────────────── */
const getConnections = async (req, res, next) => {
  try {
    const connections = await Connection.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [{ requesterId: req.userId }, { recipientId: req.userId }],
      },
    });

    const enriched = await Promise.all(connections.map(async (c) => {
      const otherId = c.requesterId === req.userId ? c.recipientId : c.requesterId;
      const user    = await User.findByPk(otherId, {
        attributes: ['id', 'name', 'profilePicture', 'bio', 'interests'],
      });
      if (!user) return null;
      const parts = user.name.split(' ');
      return {
        id:       c.id,
        userId:   user.id,
        name:     user.name,
        initials: parts.length >= 2 ? parts[0][0] + parts[1][0] : user.name.slice(0, 2).toUpperCase(),
        bio:      user.bio,
        interests: user.interests,
        profilePicture: user.profilePicture,
      };
    }));

    res.status(200).json({ connections: enriched.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

/* ── POST /api/connections/request/:userId — send connection request  */
const sendRequest = async (req, res, next) => {
  try {
    const { userId: recipientId } = req.params;
    const requesterId = req.userId;

    if (requesterId === recipientId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    // Check if already exists
    const existing = await Connection.findOne({
      where: {
        [Op.or]: [
          { requesterId, recipientId },
          { requesterId: recipientId, recipientId: requesterId },
        ],
      },
    });
    if (existing) {
      return res.status(400).json({ message: `Connection already ${existing.status}` });
    }

    const activityContext = req.body.activityContext || null;
    await Connection.create({ requesterId, recipientId, activityContext });

    // Notify the recipient
    const requester = await User.findByPk(requesterId, { attributes: ['name'] });
    await createNotification({
      userId:        recipientId,
      type:          'connection_request',
      title:         'New connection request',
      message:       `${requester?.name || 'Someone'} sent you a connection request`,
      relatedUserId: requesterId,
    });

    res.status(201).json({ message: 'Connection request sent' });
  } catch (error) {
    next(error);
  }
};

/* ── PUT /api/connections/:id/accept — accept a request ─────────── */
const acceptRequest = async (req, res, next) => {
  try {
    const conn = await Connection.findOne({
      where: { id: req.params.id, recipientId: req.userId, status: 'pending' },
    });
    if (!conn) return res.status(404).json({ message: 'Request not found' });

    await conn.update({ status: 'accepted' });

    // Notify the original requester their request was accepted
    const acceptor = await User.findByPk(req.userId, { attributes: ['name'] });
    await createNotification({
      userId:        conn.requesterId,
      type:          'connection_request',
      title:         'Connection accepted',
      message:       `${acceptor?.name || 'Someone'} accepted your connection request`,
      relatedUserId: req.userId,
    });

    // Notify acceptor (confirmation in their feed)
    const requester = await User.findByPk(conn.requesterId, { attributes: ['name'] });
    await createNotification({
      userId:        req.userId,
      type:          'connection_request',
      title:         'You are now connected',
      message:       `You and ${requester?.name || 'Someone'} are now connected`,
      relatedUserId: conn.requesterId,
    });

    res.status(200).json({ message: 'Connection accepted' });
  } catch (error) {
    next(error);
  }
};

/* ── PUT /api/connections/:id/decline — decline a request ──────── */
const declineRequest = async (req, res, next) => {
  try {
    const conn = await Connection.findOne({
      where: { id: req.params.id, recipientId: req.userId, status: 'pending' },
    });
    if (!conn) return res.status(404).json({ message: 'Request not found' });

    await conn.update({ status: 'declined' });
    res.status(200).json({ message: 'Connection declined' });
  } catch (error) {
    next(error);
  }
};

/* ── Helpers ──────────────────────────────────────────────────────── */
function formatTime(date) {
  const diff  = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

module.exports = { getRequests, getConnections, sendRequest, acceptRequest, declineRequest };
