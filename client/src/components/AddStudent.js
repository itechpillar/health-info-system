import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';

const AddStudent = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    fatherName: '',
    motherName: '',
    contactNumber: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const studentData = {
        ...formData,
        grade: parseInt(grade)
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/students`, studentData);
      navigate(`/grade/${grade}`);
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Left Sidebar */}
      <Box sx={{
        width: 250,
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        bgcolor: '#1e2632',
        color: 'white',
        p: 2
      }}>
        <Typography variant="h5" sx={{ mb: 4 }}>School Dashboard</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            sx={{
              color: 'white',
              justifyContent: 'flex-start',
              bgcolor: 'rgba(255,255,255,0.08)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' }
            }}
          >
            Students
          </Button>
          <Button
            sx={{
              color: 'white',
              justifyContent: 'flex-start',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' }
            }}
          >
            Teachers
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ marginLeft: '250px', width: 'calc(100% - 250px)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(`/grade/${grade}`)} sx={{ mr: 2 }}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="h4" component="h1">
            Add New Student to Grade {grade}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField
                required
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                required
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                required
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Father's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Mother's Name"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                required
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                required
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                onClick={() => navigate(`/grade/${grade}`)}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Student'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddStudent;
