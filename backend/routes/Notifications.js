const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { broadcast } = require('../Service/Sockets');
const authenticateToken = require('../Middleware/authentication');
const redisClient = require('../config/redis');

// Utility function for error responses
const handleError = (res, error, message = 'Internal Server Error') => {
  console.error(message, error.message);
  return res.status(500).json({ error: message });
};

// Function to insert notification into the database
const insertNotification = async (userId, message) => {
  const query = 'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *';
  const values = [userId, message];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Function to cache notification in Redis
const cacheNotification = async (notification) => {
  const redisKey = `notification:${notification.id}`;
  await redisClient.setex(redisKey, 3600, JSON.stringify(notification));
  console.log(`Notification cached in Redis: ${redisKey}`);
};

// Route: Add Notification
router.post('/add_notification', authenticateToken, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const newNotification = await insertNotification(userId, message);
    await cacheNotification(newNotification);
    
    // Broadcast notification in real-time
    broadcast({ type: 'NEW_NOTIFICATION', payload: newNotification });

    return res.status(201).json(newNotification);
  } catch (error) {
    return handleError(res, error, 'Error saving notification');
  }
});

// Route: Create Task and Notify
router.post('/create_task', authenticateToken, async (req, res) => {
  const { title, description, isComplete } = req.body;
  const userId = req.user.id;

  try {
    // Insert task into the task table (Make sure to create a task table if not done already)
    const taskQuery = 'INSERT INTO taskmaster (user_id, title, description, is_complete) VALUES ($1, $2, $3, $4) RETURNING *';
    const taskValues = [userId, title, description, isComplete];
    const taskResult = await pool.query(taskQuery, taskValues);
    console.log('Task created:', taskResult.rows[0]);  // Log the result of the query
    const newTask = taskResult.rows[0];
    

    // Create a notification for task creation
    const notificationMessage = `New Task Created: ${title}`;
    const newNotification = await insertNotification(userId, notificationMessage);
    await cacheNotification(newNotification);

    // Broadcast task-related notification in real-time
    broadcast({ type: 'NEW_NOTIFICATION', payload: newNotification });

    return res.status(201).json({ task: newTask, notification: newNotification });
  } catch (error) {
    return handleError(res, error, 'Error creating task and notification');
  }
});

// DELETE NOTIFICATION
router.delete('/delete_notification/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Ensure the user can only delete their own notifications
    const result = await pool.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [+id, +userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Notification not found');
    }

    // Remove cached entry from Redis if necessary
    const redisKey = `notification:${id}`;
    await redisClient.del(redisKey);

    console.log('Notification deleted');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error.message);
    res.status(500).send('Error deleting notification');
  }
});

// GET NOTIFICATIONS
const getUserNotificationsKey = (userId) => `notifications:user:${userId}`;

router.get('/get_notifications', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const redisKey = getUserNotificationsKey(userId);

  try {
    // Check cache first
    const cachedNotifications = await redisClient.get(redisKey);
    if (cachedNotifications) {
      console.log('Cache hit - Returning notifications from Redis');
      return res.status(200).json(JSON.parse(cachedNotifications));
    }

    console.log('Cache miss - Fetching notifications from PostgreSQL');

    // Fetch from PostgreSQL
    const { rows: notifications } = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY timestamp DESC',
      [userId]
    );

    if (notifications.length === 0) {
      return res.status(200).json({ message: 'No notifications found' });
    }

    // Cache and return results
    await redisClient.setex(redisKey, 3600, JSON.stringify(notifications));
    console.log('Notifications cached successfully');
    res.status(200).json(notifications);

  } catch (error) {
    console.error(`Error fetching notifications (User ID: ${userId}):`, error.message);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

module.exports = router;