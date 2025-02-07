import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import { register } from '../../service/http';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }
    try {
      await register({ email, password });
      setSnackbar({ open: true, message: 'Registration successful! Redirecting...', severity: 'success' });
      setTimeout(() => navigate('/Verification'), 1000);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Registration failed. Please try again.', 
        severity: 'error' 
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} textAlign="center">
        <Typography variant="h4" fontWeight="bold" mb={3}>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, borderRadius: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2, borderRadius: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2, borderRadius: 2 }}
          />
          <Button 
            variant="contained" 
            type="submit"
            sx={{ mt: 2, bgcolor: 'black', color: 'white', borderRadius: 2, '&:hover': { bgcolor: '#333' } }}
          >
            Register
          </Button>
        </form>
      </Box>

      {/* Snackbar for Notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;