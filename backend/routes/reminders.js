const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reminderController = require('../controllers/reminderController');

router.get('/', auth, reminderController.getReminders);
router.post('/', auth, reminderController.createReminder);
router.put('/:id', auth, reminderController.updateReminder);
router.delete('/:id', auth, reminderController.deleteReminder);

module.exports = router; 