import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  MenuItem,
  CircularProgress,
  Divider
} from '@mui/material';
import { Save, X } from 'lucide-react';
import { API_ENDPOINTS } from '../config';
import axios from 'axios';

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    grade: '',
    bloodType: '',
    address: '',
    contactNumber: '',
    fatherName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const GENDER_OPTIONS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  const BLOOD_TYPES = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  const GRADES = [
    { value: 0, label: 'Kindergarten' },
    { value: 1, label: '1st Grade' },
    { value: 2, label: '2nd Grade' },
    { value: 3, label: '3rd Grade' },
    { value: 4, label: '4th Grade' },
    { value: 5, label: '5th Grade' },
    { value: 6, label: '6th Grade' },
    { value: 7, label: '7th Grade' },
    { value: 8, label: '8th Grade' },
    { value: 9, label: '9th Grade' },
    { value: 10, label: '10th Grade' },
    { value: 11, label: '11th Grade' },
    { value: 12, label: '12th Grade' }
  ];

  const getGradeLabel = (gradeValue) => {
    const grade = GRADES.find(g => g.value === parseInt(gradeValue));
    return grade ? grade.label : '';
  };

  useEffect(() => {
    if (isEditMode) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.STUDENTS}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const student = response.data;
      setFormData({
        ...student,
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
        grade: student.grade.toString() // Convert number to string for the select input
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      setError('Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = isEditMode 
        ? `${API_ENDPOINTS.STUDENTS}/${id}`
        : API_ENDPOINTS.STUDENTS;
      
      const method = isEditMode ? 'put' : 'post';
      
      // Convert grade to number before sending to API
      const payload = {
        ...formData,
        grade: parseInt(formData.grade)
      };
      
      await axios[method](url, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('Student saved successfully');
      setTimeout(() => {
        navigate('/students');
      }, 1500);
    } catch (error) {
      console.error('Error saving student:', error);
      setError('Failed to save student data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 3 }}>
      <Box mb={3}>
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
          {isEditMode ? `Edit Student: ${formData.firstName} ${formData.lastName}` : 'Add New Student'}
        </Typography>
        {isEditMode && (
          <Typography variant="subtitle1" color="text.secondary">
            Grade: {getGradeLabel(formData.grade)} | Date of Birth: {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not set'}
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              {GENDER_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              select
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            >
              {GRADES.map(grade => (
                <MenuItem key={grade.value} value={grade.value}>
                  {grade.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Blood Type"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
            >
              {BLOOD_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/students')}
                startIcon={<X />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                disabled={loading}
              >
                {isEditMode ? 'Update Student' : 'Add Student'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default StudentForm;
