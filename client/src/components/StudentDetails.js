import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { ArrowLeft, Edit, Plus } from 'lucide-react';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const API_URL = `${process.env.REACT_APP_API_URL}/students`;
      
      // Fetch student details
      const studentResponse = await axios.get(`${API_URL}/${id}`);
      if (!studentResponse.data) {
        throw new Error('Student not found');
      }
      setStudent(studentResponse.data);

      // Fetch health records
      const recordsResponse = await axios.get(`${API_URL}/${id}/health-records`);
      setHealthRecords(recordsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getOrdinalSuffix = (grade) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = grade % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!student) return <Alert severity="info">Student not found</Alert>;

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
      <Box sx={{ marginLeft: '250px' }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.primary' }}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="h4">Back</Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Student Details</Typography>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/students/edit/${student.id}`)}
            >
              Edit Details
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Student Name
                </Typography>
                <Typography variant="h6">
                  {`${student.firstName} ${student.lastName}`}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Father's Name
                </Typography>
                <Typography variant="h6">
                  {student.fatherName || '-'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Grade
                </Typography>
                <Typography variant="h6">
                  {`${student.grade}${getOrdinalSuffix(student.grade)} Grade`}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="h6">
                  {student.address || '-'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Contact Number
                </Typography>
                <Typography variant="h6">
                  {student.contactNumber || '-'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Blood Type
                </Typography>
                <Typography variant="h6">
                  {student.bloodType || '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Health Records</Typography>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={() => navigate(`/students/${student.id}/health-record/add`)}
            >
              Add Health Record
            </Button>
          </Box>

          <TableContainer>
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
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {healthRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No health records found
                    </TableCell>
                  </TableRow>
                ) : (
                  healthRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>{record.height}</TableCell>
                      <TableCell>{record.weight}</TableCell>
                      <TableCell>{record.bmi?.toFixed(1) || '-'}</TableCell>
                      <TableCell>{record.bloodPressure || '-'}</TableCell>
                      <TableCell>{record.temperature}</TableCell>
                      <TableCell>{record.notes || '-'}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => navigate(`/students/${student.id}/health-record/edit/${record.id}`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default StudentDetails;
