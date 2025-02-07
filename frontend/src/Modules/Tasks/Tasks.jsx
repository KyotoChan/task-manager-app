import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import NotificationList from "./NotificationList";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../../service/WebSocket";
import {
  getNotifications,
  addNotification,
  deleteNotification,
  createTask,  // New API call for task creation
} from "../../service/http";

// Notifications component
const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // Local state for fetched notifications
  const [realTimeNotifications, setRealTimeNotifications] = useState([]); // Notifications received via WebSocket
  const [newNotificationText, setNewNotificationText] = useState(""); // State for manual notification input
  const [taskTitle, setTaskTitle] = useState(""); // Task title input
  const [taskDescription, setTaskDescription] = useState(""); // Task description input
  const [isComplete, setIsComplete] = useState(false); // Completion checkbox

  // Fetch all notifications for logged-in user
  const fetchUserNotifications = async () => {
    try {
      const response = await getNotifications();
      console.log("data", response);
      if (response) {
        setNotifications(response); // Set database notifications only for logged-in user
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Fetch notifications after logging in
    fetchUserNotifications();

    const ws = connectWebSocket();

    const handleWebSocketMessage = (event) => {
      const data = JSON.parse(event.data);

      // Deduplicate logic ensures real-time notifications don't repeat
      setRealTimeNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        if (existingIds.has(data.id)) {
          return prev; // Don't add duplicates
        }
        return [data, ...prev];
      });
    };

    ws.onmessage = handleWebSocketMessage;

    return () => disconnectWebSocket();
  }, []);

  // Handle manual task creation
  const handleAddTask = async () => {
    if (!taskTitle || !taskDescription) return;
  
    try {
      // This server call already creates the task AND notification
      const taskResponse = await createTask({ 
        title: taskTitle, 
        description: taskDescription, 
        isComplete 
      });
  
      // Remove these lines:
      // const notificationMessage = `New Task Created: ${taskTitle}`;
      // const notificationResponse = await addNotification({ message: notificationMessage });
  
      // Update state with the notification from taskResponse:
      setNotifications((prev) => {
        const newNotifications = prev.concat(taskResponse.notification);
        return Array.from(new Map(newNotifications.map((n) => [n.id, n])).values());
      });
  
      // Reset fields...
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      console.log("Notification deleted successfully");
      let filteredNotifications = notifications.filter((notification) => notification.id !== id);
      setNotifications(filteredNotifications);
      // Fetch the latest notifications from DB to ensure sync
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Merge notifications with deduplication logic
  const mergedNotifications = [
    ...new Map(
      [...realTimeNotifications, ...notifications].map((n) => [n.id, n])
    ).values(),
  ];

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" mb={2}>
          Task Management & Notifications
        </Typography>

        {/* Task Input Section */}
        <Stack direction="column" spacing={2} mb={4}>
          <TextField
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            label="Task Title"
            variant="outlined"
          />
          <TextField
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            label="Task Description"
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isComplete}
                onChange={() => setIsComplete(!isComplete)}
              />
            }
            label="Task Completed"
          />
          <Button onClick={handleAddTask} variant="contained">
            Create Task
          </Button>
        </Stack>

        {/* Notification List */}
        {!!notifications.length && (
          <NotificationList
            notifications={notifications}
            onDelete={handleDeleteNotification}
          />
        )}
      </Box>
    </Container>
  );
};

export default Notifications;