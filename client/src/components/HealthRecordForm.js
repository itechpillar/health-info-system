import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/health-records';

const HealthRecordForm = () => {
  const navigate = useNavigate();
  const { id, studentId } = useParams();
  const location = useLocation();
  const { studentName, returnPath } = location.state || {};
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    recordDate: new Date().toISOString().split('T')[0],
    recordType: '',
    height: '',
    weight: '',
    bloodPressure: '',
    temperature: '',
    nextAppointment: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchHealthRecord();
    }
  }, [id]);

  const fetchHealthRecord = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${id}`);
      const record = response.data;
      setFormData({
        recordDate: record.recordDate?.split('T')[0] || '',
        recordType: record.recordType || '',
        height: record.height || '',
        weight: record.weight || '',
        bloodPressure: record.bloodPressure || '',
        temperature: record.temperature || '',
        nextAppointment: record.nextAppointment?.split('T')[0] || '',
        notes: record.notes || ''
      });
    } catch (err) {
      console.error('Error fetching health record:', err);
      setError('Failed to fetch health record details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        studentId: studentId || formData.studentId
      };

      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(returnPath || '/', { replace: true });
      }, 1500);
    } catch (err) {
      console.error('Error saving health record:', err);
      setError('Failed to save health record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    navigate(returnPath || '/', { replace: true });
  };

  if (loading && !formData.recordType) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowLeft />}
            onClick={handleCancel}
            sx={{ minWidth: 'auto' }}
          >
            Back
          </Button>
          <Typography variant="h5" component="h1">
            {isEditMode ? 'Edit' : 'New'} Health Record
            {studentName && <Typography variant="subtitle1" color="text.secondary">
              for {studentName}
            </Typography>}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Health record {isEditMode ? 'updated' : 'created'} successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3, mb: 3 }}>
            <TextField
              fullWidth
              label="Record Date"
              type="date"
              name="recordDate"
              value={formData.recordDate}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Record Type"
              name="recordType"
              value={formData.recordType}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Height (cm)"
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              inputProps={{ step: "0.1" }}
            />
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              inputProps={{ step: "0.1" }}
            />
            <TextField
              fullWidth
              label="Blood Pressure"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Temperature (°F)"
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              inputProps={{ step: "0.1" }}
            />
            <TextField
              fullWidth
              label="Next Appointment"
              type="date"
              name="nextAppointment"
              value={formData.nextAppointment}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Create')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default HealthRecordForm;
