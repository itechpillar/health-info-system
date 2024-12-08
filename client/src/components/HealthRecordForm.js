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
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { Save, X } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

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

const HealthRecordForm = ({ initialData }) => {
  const navigate = useNavigate();
  const { id: recordId } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId') || initialData?.studentId;
  const [student, setStudent] = useState(null);
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
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.STUDENTS}/${studentId}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
        setError('Failed to fetch student information');
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!recordId) {
        if (initialData) {
          setFormData({
            ...initialData,
            recordDate: initialData.recordDate ? new Date(initialData.recordDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            nextAppointment: initialData.nextAppointment ? new Date(initialData.nextAppointment).toISOString().split('T')[0] : ''
          });
        }
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINTS.HEALTH_RECORDS}/${recordId}`);
        const record = response.data;
        
        setFormData({
          ...record,
          recordDate: record.recordDate ? new Date(record.recordDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          nextAppointment: record.nextAppointment ? new Date(record.nextAppointment).toISOString().split('T')[0] : ''
        });
      } catch (error) {
        console.error('Error fetching record:', error);
        setError('Failed to fetch record');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [recordId, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate BMI if height and weight are present
    if ((name === 'height' || name === 'weight') && formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData(prev => ({
          ...prev,
          bmi: bmi
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...formData,
        studentId: studentId
      };

      if (recordId) {
        await axios.put(`${API_ENDPOINTS.HEALTH_RECORDS}/${recordId}`, payload);
      } else {
        await axios.post(API_ENDPOINTS.HEALTH_RECORDS, payload);
      }

      navigate(-1);
    } catch (error) {
      console.error('Error saving record:', error);
      setError('Failed to save health record');
    } finally {
      setLoading(false);
    }
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
      {student && (
        <Box mb={3}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
            Health Record for {student.firstName} {student.lastName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Grade: {student.grade} | Date of Birth: {new Date(student.dateOfBirth).toLocaleDateString()}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="date"
              name="recordDate"
              label="Record Date"
              value={formData.recordDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              select
              name="recordType"
              label="Record Type"
              value={formData.recordType}
              onChange={handleChange}
            >
              {RECORD_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="height"
              label="Height (cm)"
              type="number"
              value={formData.height}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="weight"
              label="Weight (kg)"
              type="number"
              value={formData.weight}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="temperature"
              label="Temperature (°C)"
              type="number"
              value={formData.temperature}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="bloodPressure"
              label="Blood Pressure"
              value={formData.bloodPressure}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="bmi"
              label="BMI"
              value={formData.bmi}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              name="allergies"
              label="Allergies"
              value={formData.allergies}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              name="medications"
              label="Medications"
              value={formData.medications}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="notes"
              label="Notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              name="treatmentPlan"
              label="Treatment Plan"
              value={formData.treatmentPlan}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              name="nextAppointment"
              label="Next Appointment"
              value={formData.nextAppointment}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
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
                Save Record
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default HealthRecordForm;
