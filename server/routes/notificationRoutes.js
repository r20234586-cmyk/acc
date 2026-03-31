const express = require('express');
const { getNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const auth = require('../middleware/auth');

const router = express.Router();

/* GET /api/notifications — list current user's notifications */
router.get('/', auth, getNotifications);

/* PUT /api/notifications/read-all — mark all as read */
router.put('/read-all', auth, markAllRead);

/* PUT /api/notifications/:id/read — mark one as read */
router.put('/:id/read', auth, markRead);

module.exports = router;
