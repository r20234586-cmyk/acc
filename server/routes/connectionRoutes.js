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

/* POST /api/connect — send connection request */
router.post('/', auth, sendRequest);

/* POST /api/connect/accept — accept request */
router.post('/accept', auth, acceptRequest);

/* POST /api/connect/reject — reject request */
router.post('/reject', auth, declineRequest);

/* GET /api/connections — accepted connections list */
router.get('/', auth, getConnections);

/* GET /api/connections/requests — incoming pending requests */
router.get('/requests', auth, getRequests);

module.exports = router;
