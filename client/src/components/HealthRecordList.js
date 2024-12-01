import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Paper,
  IconButton,
  Typography,
  Box,
  Button,
  Tooltip,
  Chip,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Calendar,
  Activity,
  Ruler,
  Scale
} from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';

const API_URL = 'http://localhost:5000/api/students';
const HEALTH_RECORDS_API_URL = 'http://localhost:5000/api/health-records';

const iconProps = {
  size: 18,
  strokeWidth: 1.5
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = parseISO(dateString);
  return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid Date';
};

const getBMICategory = (bmi) => {
  if (!bmi) return null;
  if (bmi < 16) return { label: 'Severely Underweight', color: '#1565C0', bgColor: '#E3F2FD' };
  if (bmi < 18.5) return { label: 'Underweight', color: '#2196F3', bgColor: '#BBDEFB' };
  if (bmi < 25) return { label: 'Normal', color: '#2E7D32', bgColor: '#E8F5E9' };
  if (bmi < 30) return { label: 'Overweight', color: '#ED6C02', bgColor: '#FFF3E0' };
  return { label: 'Obese', color: '#D32F2F', bgColor: '#FFEBEE' };
};

const BMIDisplay = ({ bmi }) => {
  const category = getBMICategory(bmi);
  if (!category) return null;

  return (
    <Chip
      label={`BMI: ${bmi.toFixed(1)} (${category.label})`}
      sx={{
        backgroundColor: category.bgColor,
        color: category.color,
        fontWeight: 500,
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};

const HealthRecordList = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const [healthRecords, setHealthRecords] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsResponse, studentResponse] = await Promise.all([
        axios.get(`${HEALTH_RECORDS_API_URL}/student/${studentId}`),
        axios.get(`${API_URL}/${studentId}`)
      ]);
      
      console.log('Health Records:', recordsResponse.data); // Debug log
      setHealthRecords(recordsResponse.data);
      setStudent(studentResponse.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch health records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`${HEALTH_RECORDS_API_URL}/${recordId}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
      setError('Failed to delete record');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', px: 2 }}>
          <Button
            startIcon={<ArrowLeft {...iconProps} />}
            onClick={() => navigate('/')}
            sx={{
              mb: 2,
              color: '#666',
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              ml: -1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                color: '#2f3542'
              }
            }}
          >
            Back to Students
          </Button>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#2f3542' }}>
                {student ? `${student.firstName}'s Health Records` : 'Health Records'}
              </Typography>
              <Tooltip title="Add Health Record" arrow placement="right">
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/health-records/new?studentId=${studentId}`)}
                  sx={{
                    minWidth: '36px',
                    width: '36px',
                    height: '36px',
                    p: 0,
                    borderRadius: '8px',
                    backgroundColor: '#4834d4',
                    '&:hover': {
                      backgroundColor: '#686de0',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 3px 10px rgba(72, 52, 212, 0.2)',
                    },
                  }}
                >
                  <Plus size={18} />
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: '1200px', margin: '0 auto', px: 2 }}>
        <Grid container spacing={3}>
          {healthRecords.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.3s ease-in-out',
                  },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {record.recordType}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                      <Calendar {...iconProps} />
                      <Typography variant="body2">
                        {formatDate(record.recordDate)}
                      </Typography>
                    </Box>
                  </Box>
                  <BMIDisplay bmi={record.bmi} />
                </Box>

                <Box display="flex" flexDirection="column" gap={1.5}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Ruler {...iconProps} />
                    <Typography variant="body2">
                      Height: {record.height} cm
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Scale {...iconProps} />
                    <Typography variant="body2">
                      Weight: {record.weight} kg
                    </Typography>
                  </Box>
                  {record.notes && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        p: 1,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        fontSize: '0.875rem',
                      }}
                    >
                      {record.notes}
                    </Typography>
                  )}
                </Box>

                <Box 
                  display="flex" 
                  gap={1}
                  mt="auto"
                  pt={2}
                  sx={{
                    '& .MuiButton-root': {
                      minWidth: { xs: '0', sm: 'auto' },
                    }
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={isMobile ? null : <Edit {...iconProps} />}
                    onClick={() => {
                      console.log('Record:', record); // Debug log
                      navigate(`/health-records/edit/${record.id}?studentId=${studentId}`);
                    }}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      flex: 1,
                      whiteSpace: 'nowrap',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      padding: isMobile ? '4px 8px' : undefined,
                    }}
                  >
                    {isMobile ? 'Edit' : 'Edit Record'}
                  </Button>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(record.id)}
                  >
                    <Trash2 {...iconProps} />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HealthRecordList;
