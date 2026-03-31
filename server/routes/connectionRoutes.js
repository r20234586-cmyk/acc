const express = require('express');
const {
  getRequests,
  getConnections,
  sendRequest,
  acceptRequest,
  declineRequest,
} = require('../controllers/connectionController');
const auth = require('../middleware/auth');

const router = express.Router();

/* GET /api/connections              — accepted connections list */
router.get('/', auth, getConnections);

/* GET /api/connections/requests     — incoming pending requests */
router.get('/requests', auth, getRequests);

/* POST /api/connections/request/:userId — send a request */
router.post('/request/:userId', auth, sendRequest);

/* PUT /api/connections/:id/accept   — accept a request */
router.put('/:id/accept', auth, acceptRequest);

/* PUT /api/connections/:id/decline  — decline a request */
router.put('/:id/decline', auth, declineRequest);

module.exports = router;
