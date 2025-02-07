import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import PreferencesForm from './PreferenceList';
import { getPreferences } from '../../service/http';

const Preferences = () => {
  const [preferences, setPreferences] = useState([]);

  const fetchPreferences = async () => {
    try {
      const response = await getPreferences();
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4">User Preferences</Typography>
        <PreferencesForm preferences={preferences} fetchPreferences={fetchPreferences} />
      </Box>
    </Container>
  );
};

export default Preferences;