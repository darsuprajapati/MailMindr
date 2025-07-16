const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminController = require('../controllers/adminController');

router.get('/users', auth, admin, adminController.getUsers);
router.delete('/users/:id', auth, admin, adminController.deleteUser);
router.get('/reminders', auth, admin, adminController.getReminders);
router.delete('/reminders/:id', auth, admin, adminController.deleteReminder);

module.exports = router; 