import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import { verify } from '../../service/http';

const Verify = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button while processing

    try {
      await verify({ token });
      setSnackbar({ open: true, message: 'Verification successful! Redirecting...', severity: 'success' });

      setTimeout(() => navigate('/Login'), 1500);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Verification failed. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} p={4} textAlign="center" sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} color="black">
          Verify Your Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Verification Token"
            variant="outlined"
            fullWidth
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth 
            sx={{ mt: 2 }} 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      </Box>

      {/* Snackbar for Feedback Messages */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Verify;