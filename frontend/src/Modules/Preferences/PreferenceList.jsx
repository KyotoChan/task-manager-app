import React, { useState } from 'react';
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography, Stack } from '@mui/material';
import { updatePreference, mutePreference, unmutePreference } from '../../service/http';

const PreferencesForm = ({ preferences, fetchPreferences }) => {
  const [preferenceType, setPreferenceType] = useState('');
  
  // Update options to reflect your custom preference choices
  const preference_choices = ['Both', 'Email', 'Notification Only'];

  const handleUpdate = async () => {
    try {
      await updatePreference({ preference_type: preferenceType });
      fetchPreferences(); // Refresh preferences
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  };

  const handleMute = async () => {
    try {
      await mutePreference({ preference_type: preferenceType });
      fetchPreferences(); // Refresh preferences
    } catch (error) {
      console.error('Error muting preference:', error);
    }
  };

  const handleUnmute = async () => {
    try {
      await unmutePreference({ preference_type: preferenceType });
      fetchPreferences(); // Refresh preferences
    } catch (error) {
      console.error('Error unmuting preference:', error);
    }
  };

  return (
    <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" mb={2} color="primary">
        Manage Preferences
      </Typography>

      <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
        <InputLabel>Preference Type</InputLabel>
        <Select
          value={preferenceType}
          onChange={(e) => setPreferenceType(e.target.value)}
          label="Preference Type"
          sx={{ backgroundColor: '#fff' }}
        >
          {preference_choices.map((pref) => (
            <MenuItem key={pref} value={pref}>
              {pref}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
        <Button variant="contained" color="warning" onClick={handleMute}>
          Mute
        </Button>
        <Button variant="contained" color="success" onClick={handleUnmute}>
          Unmute
        </Button>
      </Stack>
    </Box>
  );
};

export default PreferencesForm;