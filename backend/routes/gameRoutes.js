const express = require('express');
const router = express.Router();
const { submitScore } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit-score', protect, submitScore);

module.exports = router;