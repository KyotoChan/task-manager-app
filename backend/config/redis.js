const Redis = require('ioredis');

// Create Redis client
const redisClient = new Redis({
  host: 'localhost', // Default Redis host
  port: 6379,        // Default Redis port
});

// Redis connection event logging
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redisClient;