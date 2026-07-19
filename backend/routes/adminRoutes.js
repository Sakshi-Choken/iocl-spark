const express = require('express');
const router = express.Router();
const { getAllEmployees, deleteEmployee, updateEmployee, getLoginHistory } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/employees', protect, adminOnly, getAllEmployees);
router.delete('/employees/:id', protect, adminOnly, deleteEmployee);
router.put('/employees/:id', protect, adminOnly, updateEmployee);
router.get('/login-history', protect, adminOnly, getLoginHistory);

module.exports = router;