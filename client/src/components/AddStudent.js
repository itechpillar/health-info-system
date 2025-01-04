import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
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

  const GENDER_OPTIONS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

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
    <Box sx={{ flexGrow: 1 }}>
      {/* Header - Now fixed at top */}
      <Box
        sx={{
          bgcolor: '#1e2632',
          color: 'white',
          p: 2,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
        }}
      >
        <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
          School Dashboard
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          mt: '64px', // Height of the header
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 2, sm: 4 },
          flexWrap: 'wrap',
          gap: 1
        }}>
          <IconButton 
            onClick={() => navigate(`/grade/${grade}`)}
            sx={{ mr: { xs: 1, sm: 2 } }}
          >
            <ArrowLeft />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              flex: 1
            }}
          >
            Add New Student to Grade {grade}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ 
              display: 'grid', 
              gap: { xs: 2, sm: 3 },
              gridTemplateColumns: { 
                xs: '1fr',
                sm: 'repeat(2, 1fr)' 
              }
            }}>
              <TextField
                required
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              <TextField
                required
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              <TextField
                required
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
                size="small"
              >
                {GENDER_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Father's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Mother's Name"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              <TextField
                required
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                fullWidth
                size="small"
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
                size="small"
              />
            </Box>
            <Box sx={{ 
              mt: { xs: 2, sm: 3 }, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
              justifyContent: 'flex-end' 
            }}>
              <Button
                type="button"
                onClick={() => navigate(`/grade/${grade}`)}
                variant="outlined"
                color="primary"
                fullWidth={{ xs: true, sm: false }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth={{ xs: true, sm: false }}
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
