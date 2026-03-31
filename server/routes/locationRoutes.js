const express = require('express');
const auth = require('../middleware/auth');
const { updateLocation, getNearbyUsers, getNearbyActivities } = require('../controllers/locationController');

const router = express.Router();

// Save user's coordinates (requires auth)
router.post('/update', auth, updateLocation);

// Get nearby users (requires auth to exclude self)
router.get('/nearby-users', auth, getNearbyUsers);

// Get nearby activities (public – no auth required)
router.get('/nearby-activities', auth, getNearbyActivities);

module.exports = router;
