/* ═══════════════════════════════════════════════════════════════════
   Chat Routes
   ─────────────────────────────────────────────────────────────────
   All chat routes require authentication (auth middleware).
   The activityId in the URL identifies which group chat to use.
   ═══════════════════════════════════════════════════════════════════ */

const express = require('express');
const {
  getMessages,
  sendMessage,
  deleteMessage,
  pollMessages,
} = require('../controllers/chatController');
const auth = require('../middleware/auth');

const router = express.Router();

/* Fetch last 50 messages for an activity chat (with pagination support) */
router.get('/:activityId/messages', auth, getMessages);

/* Send a new message to an activity chat */
router.post('/:activityId/messages', auth, sendMessage);

/* Delete a message (soft delete, sender only) */
router.delete('/:activityId/messages/:messageId', auth, deleteMessage);

/* Poll for new messages since a given timestamp (used by frontend polling) */
router.get('/:activityId/poll', auth, pollMessages);

module.exports = router;
