import React from 'react';
import { List, ListItem, Button, Typography } from '@mui/material';
import { getNotifications } from '../../service/http';



const NotificationList = ({ notifications, onDelete }) => {
  console.log(notifications)
  return (
    <List>
      {notifications.map((notification) => (
        <ListItem key={notification.id}> {/* Fixed: Added unique key */}
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {notification.message}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onDelete(notification.id)}
          >
            Delete
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export default NotificationList;