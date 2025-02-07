const WebSocket = require('ws');

const clients = new Set();

// Initialize WebSocket server
const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('[WebSocket] Client connected');
    clients.add(ws);

    ws.on('message', (message) => {
      console.log(`[WebSocket] Received: ${message}`);
    });

    ws.on('close', () => {
      console.log('[WebSocket] Client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (err) => {
      console.error('[WebSocket] Error:', err.message);
    });
  });
};

// Broadcast data to all connected clients
const broadcast = (data) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

module.exports = { initWebSocket, broadcast };