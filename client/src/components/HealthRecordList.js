import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Fab,
  TablePagination,
  Alert,
  Button,
  Tooltip,
  Chip,
  Container
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format, isValid, parseISO } from 'date-fns';

const API_URL = 'http://localhost:5000/api/students';
const HEALTH_RECORDS_API_URL = 'http://localhost:5000/api/health-records';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid Date';
};

const BMIDisplay = ({ bmi }) => {
  // Simple display for debugging
  return <span>{bmi ? bmi.toFixed(1) : 'N/A'}</span>;
};

const HealthRecordList = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealthRecords();
  }, [studentId]);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      console.log('Fetching health records for student:', studentId);
      
      const response = await axios.get(`${HEALTH_RECORDS_API_URL}/student/${studentId}`);
      console.log('Health records response:', response.data);
      
      // Directly set the records without processing
      setHealthRecords(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching health records:', error);
      setError('Failed to fetch health records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`${HEALTH_RECORDS_API_URL}/${recordId}`);
      await fetchHealthRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      setError('Failed to delete record');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading health records...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container>
      {/* Debug display */}
      <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6">Debug Info</Typography>
        <pre>
          {JSON.stringify(healthRecords.map(r => ({ id: r.id, bmi: r.bmi })), null, 2)}
        </pre>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/students')}
        >
          Back to Students
        </Button>
        <Fab
          color="primary"
          onClick={() => navigate(`/health-records/new/${studentId}`)}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Height (cm)</TableCell>
              <TableCell>Weight (kg)</TableCell>
              <TableCell>BMI</TableCell>
              <TableCell>Blood Pressure</TableCell>
              <TableCell>Temperature (°C)</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {healthRecords.length > 0 ? (
              healthRecords.map((record) => {
                console.log('Rendering record with BMI:', record.bmi);
                
                return (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.recordDate)}</TableCell>
                    <TableCell>{record.height}</TableCell>
                    <TableCell>{record.weight}</TableCell>
                    <TableCell>{record.bmi ? record.bmi.toFixed(1) : 'N/A'}</TableCell>
                    <TableCell>{record.bloodPressure || 'N/A'}</TableCell>
                    <TableCell>{record.temperature || 'N/A'}</TableCell>
                    <TableCell>{record.medicalNotes || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/health-records/edit/${record.id}`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(record.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No health records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default HealthRecordList;
