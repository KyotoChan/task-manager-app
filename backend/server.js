const express = require('express');
const http = require('http');
const cors = require('cors');
const { initWebSocket } = require('./Service/Sockets'); // Correct file path
const app = require('./app'); // Keep the correct app import

// CORS Options
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
// app.use(cors(corsOptions));

// Create HTTP server with Express app
const server = http.createServer(app);

// Initialize WebSocket server
initWebSocket(server);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

