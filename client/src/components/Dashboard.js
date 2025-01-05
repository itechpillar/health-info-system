import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Chip,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  Search,
  Edit,
  Trash2,
  Plus,
  FileText,
  Users,
  CalendarDays,
  User,
  Phone,
  GraduationCap,
  Settings as SettingsIcon,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { format } from 'date-fns';
import HealthRecordForm from './HealthRecordForm';
import { API_ENDPOINTS } from '../config';

const iconProps = {
  size: 20,
  strokeWidth: 1.5
};

const API_URL = API_ENDPOINTS.STUDENTS;
const HEALTH_RECORDS_API = API_ENDPOINTS.HEALTH_RECORDS;

const BMI_CATEGORIES = {
  severelyUnderweight: {
    range: [0, 16],
    label: 'Severe',
    color: '#1565C0',
    backgroundColor: '#E3F2FD',
    description: 'BMI < 16: Severely underweight - Medical attention recommended'
  },
  underweight: {
    range: [16, 18.5],
    label: 'Low',
    color: '#2196F3',
    backgroundColor: '#BBDEFB',
    description: 'BMI 16-18.5: Underweight - May need nutritional assessment'
  },
  normal: {
    range: [18.5, 25],
    label: 'Normal',
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    description: 'BMI 18.5-25: Healthy weight range'
  },
  overweight: {
    range: [25, 30],
    label: 'High',
    color: '#ED6C02',
    backgroundColor: '#FFF3E0',
    description: 'BMI 25-30: Overweight - Lifestyle changes may be beneficial'
  },
  obese: {
    range: [30, 35],
    label: 'Very High',
    color: '#D32F2F',
    backgroundColor: '#FFEBEE',
    description: 'BMI 30-35: Obese Class I - Health risks increased'
  },
  severelyObese: {
    range: [35, 40],
    label: 'Severe',
    color: '#B71C1C',
    backgroundColor: '#FFCDD2',
    description: 'BMI 35-40: Obese Class II - High health risk'
  },
  morbidallyObese: {
    range: [40, Infinity],
    label: 'Very Severe',
    color: '#801313',
    backgroundColor: '#EF9A9A',
    description: 'BMI > 40: Obese Class III - Very high health risk'
  }
};

const getBMICategory = (bmi) => {
  if (!bmi || isNaN(bmi)) return null;
  const bmiValue = typeof bmi === 'string' ? parseFloat(bmi) : bmi;
  
  for (const [category, data] of Object.entries(BMI_CATEGORIES)) {
    if (bmiValue >= data.range[0] && bmiValue < data.range[1]) {
      return { category, ...data };
    }
  }
  return null;
};

const BMIDisplay = ({ bmi }) => {
  if (!bmi || isNaN(bmi)) return 'N/A';
  
  const bmiValue = typeof bmi === 'string' ? parseFloat(bmi) : bmi;
  const category = getBMICategory(bmiValue);
  
  if (!category) return bmiValue.toFixed(1);
  
  return (
    <Tooltip 
      title={
        <div style={{ padding: '8px 0' }}>
          <div style={{ marginBottom: '4px' }}><strong>{category.description}</strong></div>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>
            Click for detailed health information
          </div>
        </div>
      } 
      arrow
    >
      <Chip
        label={`${bmiValue.toFixed(1)} (${category.label})`}
        size="small"
        sx={{
          color: category.color,
          backgroundColor: category.backgroundColor,
          fontWeight: 'medium',
          '&:hover': {
            backgroundColor: category.backgroundColor,
            opacity: 0.9,
          },
          minWidth: '120px',
          '& .MuiChip-label': {
            padding: '0 8px'
          }
        }}
      />
    </Tooltip>
  );
};

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [healthRecordCounts, setHealthRecordCounts] = useState({});
  const [gradeStats, setGradeStats] = useState({
    'All Grades': 0,
    '1st Grade': 0,
    '2nd Grade': 0,
    '3rd Grade': 0,
    '4th Grade': 0,
    '5th Grade': 0,
    '6th Grade': 0,
    '7th Grade': 0,
    '8th Grade': 0,
    '9th Grade': 0,
    '10th Grade': 0    
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setStudents(response.data);
      
      // Fetch health record counts for all students
      const counts = {};
      for (const student of response.data) {
        const recordsResponse = await axios.get(`${HEALTH_RECORDS_API}/student/${student.id}`);
        counts[student.id] = recordsResponse.data.length;
      }
      setHealthRecordCounts(counts);

      // Calculate grade statistics
      const stats = {
        'All Grades': 0,
        '1st Grade': 0,
        '2nd Grade': 0,
        '3rd Grade': 0,
        '4th Grade': 0,
        '5th Grade': 0,
        '6th Grade': 0,
        '7th Grade': 0,
        '8th Grade': 0,
        '9th Grade': 0,
        '10th Grade': 0  
      };
      
      response.data.forEach(student => {
        const gradeKey = `${student.grade}${getOrdinalSuffix(student.grade)} Grade`;
        if (stats.hasOwnProperty(gradeKey)) {
          stats[gradeKey]++;
          stats['All Grades']++;
        }
      });
      
      setGradeStats(stats);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again later.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const getOrdinalSuffix = (grade) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = grade % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  const handleDeleteDialogOpen = (student, e) => {
    if (e) {
      e.stopPropagation();
    }
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleDelete = async () => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/${studentToDelete.id}`);
      
      if (selectedStudent?.id === studentToDelete.id) {
        setSelectedStudent(null);
      }
      
      fetchStudents();
      handleDeleteDialogClose();
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student. Please try again later.');
    }
  };

  const handleViewHealthRecords = (student, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    navigate(`/student/${student.id}/health-records`);
  };

  const handleActionsClick = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
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
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Left Sidebar - Now responsive */}
      <Box sx={{
        width: { xs: '100%', md: 250 },
        position: { xs: 'static', md: 'fixed' },
        left: 0,
        top: 0,
        bottom: 0,
        bgcolor: '#1e2632',
        color: 'white',
        px: 3,
        py: 2,
        display: { xs: 'flex', md: 'block' },
        flexDirection: { xs: 'row', md: 'column' },
        justifyContent: { xs: 'space-between', md: 'flex-start' },
        alignItems: { xs: 'center', md: 'stretch' },
        zIndex: 1100,
        height: { xs: '64px', md: 'auto' },
        boxSizing: 'border-box'
      }}>
        <Box sx={{ 
          flexGrow: 1,
          overflow: 'hidden',
          mr: { xs: 2, md: 0 }
        }}>
          <Typography variant="h5" sx={{ 
            mb: { xs: 0, md: 4 },
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Health Information System
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'row', md: 'column' }, 
          gap: 1,
          flexGrow: { xs: 0, md: 1 }
        }}>
          <Button
            component={Link}
            to="/students"
            startIcon={<Users {...iconProps} />}
            sx={{
              color: 'white',
              justifyContent: 'flex-start',
              bgcolor: 'rgba(255,255,255,0.08)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
              minWidth: { xs: 'auto', md: '100%' },
              px: { xs: 2, md: 3 }
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Students</Box>
          </Button>
          <Button
            component={Link}
            to="/teachers"
            startIcon={<GraduationCap {...iconProps} />}
            sx={{
              color: 'white',
              justifyContent: 'flex-start',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
              minWidth: { xs: 'auto', md: '100%' },
              px: { xs: 2, md: 3 }
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Teachers</Box>
          </Button>
        </Box>
      </Box>

      {/* Main Content - Now responsive */}
      <Box sx={{ 
        marginLeft: { xs: 0, md: '250px' },
        p: { xs: 2, sm: 3 },
        mt: { xs: 2, md: 0 }
      }}>
        <Typography variant="h4" sx={{ 
          mb: 4,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
        }}>
          Student Grade Statistics
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {Object.entries(gradeStats).map(([grade, count]) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={grade}>
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  },
                  height: '100%'
                }}
                onClick={() => {
                  if (grade === 'All Grades') {
                    navigate('/grade/all');
                  } else {
                    const gradeNumber = parseInt(grade.split(' ')[0]);
                    navigate(`/grade/${gradeNumber}`);
                  }
                }}
              >
                <Typography variant="h5" sx={{ 
                  mb: 2, 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }}>
                  {grade}
                </Typography>
                <Typography variant="h3" sx={{ 
                  mb: 1, 
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '2.5rem' }
                }}>
                  {count}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Students
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Student
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
