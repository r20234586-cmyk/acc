const express = require('express');
const { createActivity, getAllActivities, getActivityById, joinActivity, leaveActivity, deleteActivity } = require('../controllers/activityController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createActivity);
router.get('/', getAllActivities);
router.get('/:id', getActivityById);
router.post('/:id/join', auth, joinActivity);
router.delete('/:id/leave', auth, leaveActivity);
router.delete('/:id', auth, deleteActivity); /* host-only delete */

module.exports = router;
