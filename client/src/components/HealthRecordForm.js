import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Autocomplete,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';
import PhysicalMeasurements from './PhysicalMeasurements';

const API_URL = 'http://localhost:5000/api';
const RECORD_TYPES = ['Regular Checkup', 'Vaccination', 'Illness', 'Injury', 'Other'];

const steps = ['Student Selection', 'Medical Details', 'Review'];

const HealthRecordForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentIdFromUrl = searchParams.get('studentId');
  
  const [activeStep, setActiveStep] = useState(studentIdFromUrl ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    studentId: studentIdFromUrl || id || '',  
    recordType: '',
    recordDate: new Date().toISOString().split('T')[0],
    allergies: '',
    medications: '',
    medicalConditions: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    nextCheckupDate: '',
    weight: '',
    height: ''
  });

  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data);
      if (id) {
        const student = response.data.find(s => s.id === id);
        if (student) {
          setSelectedStudent(student);
          setFormData(prev => ({ ...prev, studentId: student.id }));
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate, id]);

  const fetchRecord = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/health-records/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setFormData(prevData => ({
        ...prevData,
        ...response.data,
        studentId: response.data.studentId || response.data.Student?.id || ''
      }));

      const student = students.find(s => s.id === (response.data.studentId || response.data.Student?.id));
      if (student) {
        setSelectedStudent(student);
      }
    } catch (error) {
      console.error('Error fetching record:', error);
      setError('Failed to load record');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate, students]);

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/students/${studentId}`);
      setSelectedStudent(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Failed to fetch student details');
    }
  };

  useEffect(() => {
    fetchStudents();
    if (studentIdFromUrl) {
      fetchStudentDetails(studentIdFromUrl);
    }
  }, [studentIdFromUrl]);

  useEffect(() => {
    if (students.length > 0) {
      fetchRecord();
    }
  }, [fetchRecord, students]);

  const handleStudentSelect = (event, student) => {
    setSelectedStudent(student);
    if (student) {
      setFormData(prev => ({
        ...prev,
        studentId: student.id
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      const submitData = {
        ...formData,
        studentId: selectedStudent.id
      };

      if (id) {
        await axios.put(`${API_URL}/health-records/${id}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${API_URL}/health-records`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/students');
      }, 1500);
    } catch (error) {
      console.error('Error saving record:', error);
      setError(error.response?.data?.message || 'Failed to save record');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const renderStudentSelection = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Autocomplete
          value={selectedStudent}
          onChange={handleStudentSelect}
          options={students}
          getOptionLabel={(student) => `${student.firstName} ${student.lastName}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Student"
              required
              fullWidth
              error={!selectedStudent && error}
              helperText={!selectedStudent && error ? 'Please select a student' : ''}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          label="Record Type"
          name="recordType"
          value={formData.recordType}
          onChange={handleChange}
          fullWidth
          required
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
          type="date"
          label="Record Date"
          name="recordDate"
          value={formData.recordDate}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );

  const renderMedicalDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <PhysicalMeasurements formData={formData} handleChange={handleChange} />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Allergies"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Current Medications"
          name="medications"
          value={formData.medications}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Medical Conditions"
          name="medicalConditions"
          value={formData.medicalConditions}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Treatment"
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="date"
          label="Next Checkup Date"
          name="nextCheckupDate"
          value={formData.nextCheckupDate}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );

  const renderReview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">
          Health Record for {selectedStudent?.firstName} {selectedStudent?.lastName}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Additional Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
        />
      </Grid>
    </Grid>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Health Record' : 'New Health Record'}
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Health record saved successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {activeStep === 0 && renderStudentSelection()}
        {activeStep === 1 && renderMedicalDetails()}
        {activeStep === 2 && renderReview()}

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/health-records')}
          >
            Back to List
          </Button>
          <Box>
            {activeStep > 0 && (
              <Button
                startIcon={<NavigateBeforeIcon />}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                endIcon={<NavigateNextIcon />}
                onClick={handleNext}
                disabled={!selectedStudent}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Save Record
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default HealthRecordForm;
