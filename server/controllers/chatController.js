/* ═══════════════════════════════════════════════════════════════════
   Chat Controller
   ─────────────────────────────────────────────────────────────────
   Handles group messaging for activities.
   Business rules:
     - Only participants (joined[] contains userId) can chat
     - Host is always allowed to chat in their own activity
     - Messages are paginated (50 per page, newest last for display)
     - Soft-delete: sender can delete their own messages
   ═══════════════════════════════════════════════════════════════════ */

const ChatMessage = require('../models/ChatMessage');
const Activity    = require('../models/Activity');
const User        = require('../models/User');
const { Op }      = require('sequelize');

/* ── helper: check if user is a participant of the activity ─────────── */
async function isParticipant(activityId, userId) {
  const activity = await Activity.findByPk(activityId, {
    attributes: ['id', 'hostId', 'joined'],
  });
  if (!activity) return { allowed: false, activity: null };

  const allowed =
    activity.hostId === userId ||
    (Array.isArray(activity.joined) && activity.joined.includes(userId));

  return { allowed, activity };
}

/* ── GET /api/chat/:activityId/messages ─────────────────────────────── */
/* Returns the last N messages for an activity group chat.               */
/* Query params: before (ISO timestamp for pagination), limit (default 50) */
const getMessages = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const limit  = Math.min(parseInt(req.query.limit) || 50, 100);
    const before = req.query.before ? new Date(req.query.before) : null;

    /* Verify user is a participant before allowing them to read chat */
    const { allowed } = await isParticipant(activityId, req.userId);
    if (!allowed) {
      return res.status(403).json({
        message: 'You must join this activity to view the group chat',
      });
    }

    /* Build query — optionally paginate backwards from a timestamp */
    const where = {
      activityId,
      deletedAt: null, // exclude soft-deleted messages
    };
    if (before) {
      where.createdAt = { [Op.lt]: before };
    }

    const messages = await ChatMessage.findAll({
      where,
      order: [['createdAt', 'ASC']], // oldest first → natural chat order
      limit,
    });

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

/* ── POST /api/chat/:activityId/messages ────────────────────────────── */
/* Send a new message to the activity group chat.                        */
const sendMessage = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { text } = req.body;

    /* Validate message text */
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }
    if (text.trim().length > 2000) {
      return res.status(400).json({ message: 'Message too long (max 2000 chars)' });
    }

    /* Check user is a participant */
    const { allowed } = await isParticipant(activityId, req.userId);
    if (!allowed) {
      return res.status(403).json({
        message: 'Join this activity to participate in the group chat',
      });
    }

    /* Fetch sender details to snapshot name/avatar */
    const sender = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'profilePicture'],
    });
    if (!sender) {
      return res.status(404).json({ message: 'User not found' });
    }

    /* Build avatar initials from name */
    const nameParts = sender.name.split(' ');
    const initials  = nameParts.length >= 2
      ? nameParts[0][0] + nameParts[1][0]
      : sender.name.slice(0, 2).toUpperCase();

    /* Create and persist the message */
    const message = await ChatMessage.create({
      activityId,
      senderId:     req.userId,
      senderName:   sender.name,
      senderAvatar: initials,
      text:         text.trim(),
    });

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

/* ── DELETE /api/chat/:activityId/messages/:messageId ───────────────── */
/* Soft-deletes a message. Only the original sender can delete.          */
const deleteMessage = async (req, res, next) => {
  try {
    const { activityId, messageId } = req.params;

    const msg = await ChatMessage.findOne({
      where: { id: messageId, activityId, deletedAt: null },
    });

    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }

    /* Only the sender may delete their own message */
    if (msg.senderId !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own messages' });
    }

    /* Soft delete */
    await msg.update({ deletedAt: new Date() });

    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

/* ── GET /api/chat/:activityId/poll ─────────────────────────────────── */
/* Long-poll endpoint: returns messages newer than `since` timestamp.    */
/* Frontend polls every 3s to get new messages (replaces WebSocket).     */
const pollMessages = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const since = req.query.since ? new Date(req.query.since) : null;

    /* Verify participation */
    const { allowed } = await isParticipant(activityId, req.userId);
    if (!allowed) {
      return res.status(403).json({
        message: 'You must join this activity to view the group chat',
      });
    }

    const where = { activityId, deletedAt: null };
    if (since) {
      where.createdAt = { [Op.gt]: since }; // only newer than last fetch
    }

    const messages = await ChatMessage.findAll({
      where,
      order: [['createdAt', 'ASC']],
      limit: 100,
    });

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, sendMessage, deleteMessage, pollMessages };
