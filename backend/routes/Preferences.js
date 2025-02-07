const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../Middleware/authentication');

// POST PREFERENCE
router.post('/setPreferences', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT token
    const { notification_type, status, preference_type = null } = req.body; // Defaults to null if not provided

    // Validate input
    if (!notification_type || status === undefined) {
        return res.status(400).json({ error: 'Notification type and status are required' });
    }

    try {
        // Upsert query: insert or update based on conflict (notification_type and user_id)
        const result = await pool.query(
            `INSERT INTO preferences (user_id, notification_type, status, preference_type)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, notification_type) 
            DO UPDATE SET status = EXCLUDED.status, preference_type = EXCLUDED.preference_type
            RETURNING *`,
            [userId, notification_type, status, preference_type]
        );

        res.status(200).json({
            message: 'Preferences set or updated successfully',
            preferences: result.rows[0]
        });
    } catch (error) {
        console.error('Error setting preferences:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;