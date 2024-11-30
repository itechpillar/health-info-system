import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Grid
} from '@mui/material';
import { Save, X } from 'lucide-react';

const RECORD_TYPES = [
  'Annual Physical',
  'Vaccination',
  'Illness',
  'Injury',
  'Dental',
  'Vision',
  'Mental Health',
  'Other'
];

const HealthRecordForm = ({ initialData, studentName, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    recordDate: new Date().toISOString().split('T')[0],
    recordType: 'Annual Physical',
    height: '',
    weight: '',
    bloodPressure: '',
    temperature: '',
    allergies: '',
    medications: '',
    medicalNotes: '',
    treatmentPlan: '',
    nextAppointment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      const recordDate = initialData.recordDate ? new Date(initialData.recordDate).toISOString().split('T')[0] : '';
      const nextAppointment = initialData.nextAppointment ? new Date(initialData.nextAppointment).toISOString().split('T')[0] : '';
      
      setFormData({
        recordDate: recordDate || new Date().toISOString().split('T')[0],
        recordType: initialData.recordType || 'Annual Physical',
        height: initialData.height || '',
        weight: initialData.weight || '',
        bloodPressure: initialData.bloodPressure || '',
        temperature: initialData.temperature || '',
        allergies: initialData.allergies || '',
        medications: initialData.medications || '',
        medicalNotes: initialData.medicalNotes || '',
        treatmentPlan: initialData.treatmentPlan || '',
        nextAppointment: nextAppointment || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
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

  if (loading && !formData.recordType) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {studentName && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          for {studentName}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Record Date"
              type="date"
              name="recordDate"
              value={formData.recordDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              select
              label="Record Type"
              name="recordType"
              value={formData.recordType}
              onChange={handleInputChange}
            >
              {RECORD_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Height (cm)"
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              inputProps={{ step: "0.1" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              inputProps={{ step: "0.1" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Blood Pressure"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleInputChange}
              placeholder="e.g., 120/80"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Temperature (°F)"
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              inputProps={{ step: "0.1" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Medications"
              name="medications"
              value={formData.medications}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Next Appointment"
              type="date"
              name="nextAppointment"
              value={formData.nextAppointment}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Medical Notes"
              name="medicalNotes"
              value={formData.medicalNotes}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Treatment Plan"
              name="treatmentPlan"
              value={formData.treatmentPlan}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            startIcon={<X size={20} />}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save size={20} />}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Record'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default HealthRecordForm;
