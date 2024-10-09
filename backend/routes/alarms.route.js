import express from 'express';
import {
    createAlarm,
    getAlarmsByUser,
    updateAlarm,
    deleteAlarm
} from '../controllers/alarms.controller.js';

const router = express.Router();

// Middleware to validate userId
const validateUserId = (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    next();
};

// Middleware to validate alarmId
const validateAlarmId = (req, res, next) => {
    const { alarmId } = req.params;
    if (!alarmId) {
        return res.status(400).json({ error: 'Alarm ID is required' });
    }
    next();
};

// POST: Create a new alarm for a user
router.post('/', createAlarm);

// GET: Get all alarms for a specific user
router.get('/:userId', validateUserId, getAlarmsByUser);

// PUT: Update an alarm by its ID
router.put('/:alarmId', validateAlarmId, updateAlarm);

// DELETE: Delete an alarm by its ID
router.delete('/:alarmId', validateAlarmId, deleteAlarm);

export default router;
