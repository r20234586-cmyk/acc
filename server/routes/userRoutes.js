const express = require('express');
const { getUserById } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:id', getUserById);

module.exports = router;
