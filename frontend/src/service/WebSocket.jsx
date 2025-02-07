let socket;

export const connectWebSocket = () => {
  // Create native WebSocket connection to backend
  socket = new WebSocket("ws://localhost:3000/ws"); // Add this path in server

  socket.onopen = () => {
    console.info("WebSocket connected");
  };

  socket.onclose = () => {
    console.warn("WebSocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    console.info("WebSocket connection closed");
  }
};