const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, createAnnouncement);
router.get('/', protect, getAnnouncements);
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

module.exports = router;