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
  TableRow,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowLeft, Edit, Plus } from 'lucide-react';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const HealthRecordCard = ({ record }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Date: {formatDate(record.date)}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Height: {record.height} cm
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Weight: {record.weight} kg
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              BMI: {record.bmi?.toFixed(1) || '-'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Blood Pressure: {record.bloodPressure || '-'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Temperature: {record.temperature}°C
            </Typography>
          </Grid>
          {record.notes && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Notes: {record.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => navigate(`/students/${student.id}/health-record/edit/${record.id}`)}
        >
          Edit Record
        </Button>
      </CardActions>
    </Card>
  );

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  if (!student) return <Alert severity="info" sx={{ m: 2 }}>Student not found</Alert>;

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
        {/* Back button and title */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 2, sm: 4 },
          gap: 1
        }}>
          <IconButton 
            onClick={() => navigate('/')} 
            sx={{ mr: 1 }}
          >
            <ArrowLeft />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            Student Details
          </Typography>
        </Box>

        {/* Student Information Card */}
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3 } 
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            mb: 3
          }}>
            <Typography 
              variant="h5" 
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              {`${student.firstName} ${student.lastName}`}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/students/edit/${student.id}`)}
              fullWidth={isMobile}
            >
              Edit Details
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Grade
                </Typography>
                <Typography variant="body1">
                  {`${student.grade}${getOrdinalSuffix(student.grade)} Grade`}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Father's Name
                </Typography>
                <Typography variant="body1">
                  {student.fatherName || '-'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Blood Type
                </Typography>
                <Typography variant="body1">
                  {student.bloodType || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Number
                </Typography>
                <Typography variant="body1">
                  {student.contactNumber || '-'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {student.address || '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Health Records Section */}
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            mb: 3
          }}>
            <Typography 
              variant="h5" 
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              Health Records
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={() => navigate(`/students/${student.id}/health-record/add`)}
              fullWidth={isMobile}
            >
              Add Health Record
            </Button>
          </Box>

          {healthRecords.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
              No health records found
            </Typography>
          ) : (
            <>
              {isMobile ? (
                // Mobile view - Cards
                <Box>
                  {healthRecords.map((record) => (
                    <HealthRecordCard key={record.id} record={record} />
                  ))}
                </Box>
              ) : (
                // Desktop view - Table
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
                      {healthRecords.map((record) => (
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
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/students/${student.id}/health-record/edit/${record.id}`)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default StudentDetails;
