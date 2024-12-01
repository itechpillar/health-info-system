import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
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

const API_URL = 'http://localhost:5000/api';

const HealthRecordForm = ({ initialData, studentName }) => {
  const navigate = useNavigate();
  const { id: recordId } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId') || initialData?.studentId;
  const [formData, setFormData] = useState({
    recordDate: new Date().toISOString().split('T')[0],
    recordType: 'Annual Physical',
    height: '',
    weight: '',
    bloodPressure: '',
    temperature: '',
    allergies: '',
    medications: '',
    notes: '',
    treatmentPlan: '',
    nextAppointment: '',
    bmi: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (recordId) {
        try {
          setLoading(true);
          // First try to get studentId if not available
          let currentStudentId = studentId;
          if (!currentStudentId) {
            const recordResponse = await axios.get(`${API_URL}/health-records/${recordId}`);
            currentStudentId = recordResponse.data.studentId;
          }
          
          // Now fetch the full record with student context
          const response = await axios.get(`${API_URL}/health-records/${recordId}`);
          const record = response.data;
          
          if (record) {
            setFormData({
              recordDate: record.recordDate ? new Date(record.recordDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              recordType: record.recordType || 'Annual Physical',
              height: record.height || '',
              weight: record.weight || '',
              bloodPressure: record.bloodPressure || '',
              temperature: record.temperature || '',
              allergies: record.allergies || '',
              medications: record.medications || '',
              notes: record.notes || '',
              treatmentPlan: record.treatmentPlan || '',
              nextAppointment: record.nextAppointment ? new Date(record.nextAppointment).toISOString().split('T')[0] : '',
              bmi: record.bmi || ''
            });
          }
        } catch (err) {
          console.error('Error fetching health record:', err);
          setError('Failed to load health record data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecord();
  }, [recordId, studentId]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        recordDate: initialData.recordDate ? new Date(initialData.recordDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        recordType: initialData.recordType || 'Annual Physical',
        height: initialData.height || '',
        weight: initialData.weight || '',
        bloodPressure: initialData.bloodPressure || '',
        temperature: initialData.temperature || '',
        allergies: initialData.allergies || '',
        medications: initialData.medications || '',
        notes: initialData.notes || '',
        treatmentPlan: initialData.treatmentPlan || '',
        nextAppointment: initialData.nextAppointment ? new Date(initialData.nextAppointment).toISOString().split('T')[0] : '',
        bmi: initialData.bmi || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataWithStudent = {
        ...formData,
        studentId
      };

      console.log('Sending form data:', formDataWithStudent); // Debug log

      if (recordId) {
        // Update existing record
        const response = await axios.put(`${API_URL}/health-records/${recordId}`, formDataWithStudent);
        console.log('Update response:', response.data); // Debug log
      } else {
        // Create new record
        const response = await axios.post(`${API_URL}/health-records`, formDataWithStudent);
        console.log('Create response:', response.data); // Debug log
      }

      // Navigate back to health records list
      navigate(`/student/${studentId}/health-records`);
    } catch (err) {
      console.error('Error saving health record:', err);
      console.error('Error details:', err.response?.data); // Debug log
      setError('Failed to save health record. Please try again.');
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
    if (!studentId) {
      navigate('/'); // If no studentId, go to dashboard
    } else {
      navigate(`/student/${studentId}/health-records`);
    }
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
              helperText={
                <span>
                  Normal range: <span style={{ fontWeight: 500, color: 'primary.main' }}>90/60 - 120/80</span>
                  <br />
                  Format: systolic/diastolic (e.g., 120/80)
                  <br />
                  • Normal: 90/60 - 120/80
                  <br />
                  • Elevated: 120/80 - 129/80
                  <br />
                  • High: 130/80 or higher
                </span>
              }
              FormHelperTextProps={{
                sx: { 
                  color: 'text.secondary',
                  '& span': {
                    color: 'text.secondary'
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Temperature (°C)"
              name="temperature"
              type="number"
              value={formData.temperature}
              onChange={handleInputChange}
              inputProps={{
                step: "0.1",
                min: "30",
                max: "45"
              }}
              helperText="Normal range: 36.5°C - 37.5°C (97.7°F - 99.5°F)"
              FormHelperTextProps={{
                sx: { 
                  color: 'text.secondary',
                  '& span': {
                    fontWeight: 'medium',
                    color: 'primary.main'
                  }
                }
              }}
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
              name="notes"
              value={formData.notes}
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="BMI"
              name="bmi"
              value={formData.bmi}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleCancel}
            startIcon={<X />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          >
            {loading ? 'Saving...' : 'Save Record'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default HealthRecordForm;
