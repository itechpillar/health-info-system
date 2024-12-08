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
    color: '#1565C0',  // Dark blue
    backgroundColor: '#E3F2FD',
    description: 'BMI < 16: Severely underweight - Medical attention recommended'
  },
  underweight: {
    range: [16, 18.5],
    label: 'Low',
    color: '#2196F3',  // Blue
    backgroundColor: '#BBDEFB',
    description: 'BMI 16-18.5: Underweight - May need nutritional assessment'
  },
  normal: {
    range: [18.5, 25],
    label: 'Normal',
    color: '#2E7D32',  // Green
    backgroundColor: '#E8F5E9',
    description: 'BMI 18.5-25: Healthy weight range'
  },
  overweight: {
    range: [25, 30],
    label: 'High',
    color: '#ED6C02',  // Orange
    backgroundColor: '#FFF3E0',
    description: 'BMI 25-30: Overweight - Lifestyle changes may be beneficial'
  },
  obese: {
    range: [30, 35],
    label: 'Very High',
    color: '#D32F2F',  // Red
    backgroundColor: '#FFEBEE',
    description: 'BMI 30-35: Obese Class I - Health risks increased'
  },
  severelyObese: {
    range: [35, 40],
    label: 'Severe',
    color: '#B71C1C',  // Dark red
    backgroundColor: '#FFCDD2',
    description: 'BMI 35-40: Obese Class II - High health risk'
  },
  morbidallyObese: {
    range: [40, Infinity],
    label: 'Very Severe',
    color: '#801313',  // Darker red
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
        const recordsResponse = await axios.get(`${API_URL}/${student.id}/health-records`);
        counts[student.id] = recordsResponse.data.length;
      }
      setHealthRecordCounts(counts);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again later.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
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
      
      // If the deleted student was selected, clear the selection
      if (selectedStudent?.id === studentToDelete.id) {
        setSelectedStudent(null);
      }
      
      // Refresh the students list
      fetchStudents();
      handleDeleteDialogClose();
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student. Please try again later.');
    }
  };

  const handleViewHealthRecords = (student, event) => {
    // If event exists (icon click), prevent propagation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Navigate to the health records page for this student
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

  const handleActionSelect = (action) => {
    if (!selectedStudent) return;

    switch(action) {
      case 'view':
        handleViewHealthRecords(selectedStudent);
        break;
      case 'edit':
        navigate(`/student/edit/${selectedStudent.id}`);
        break;
      case 'delete':
        handleDeleteDialogOpen(selectedStudent);
        break;
      default:
        break;
    }
    handleActionsClose();
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#2f3542' }}>
            Students
          </Typography>
          <Tooltip title="Add Student" arrow placement="left">
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => navigate('/student/add')}
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
              <UserPlus size={18} />
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} sm={6} md={6} key={student.id}>
            <Paper
              sx={{
                p: 3,
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
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User {...iconProps} />
                </Box>
                <Box>
                  <Typography variant="h6" component="h2">
                    {student.firstName} {student.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {student.grade}th Grade
                  </Typography>
                </Box>
              </Box>

              <Box 
                display="flex" 
                gap={1}
                sx={{
                  '& .MuiButton-root': {
                    minWidth: { xs: '0', sm: 'auto' },
                  }
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isMobile ? null : <FileText {...iconProps} />}
                  onClick={(e) => handleViewHealthRecords(student, e)}
                  size={isMobile ? "small" : "medium"}
                  endIcon={
                    <Box
                      sx={{
                        bgcolor: healthRecordCounts[student.id] > 0 ? 'primary.dark' : 'action.disabledBackground',
                        color: healthRecordCounts[student.id] > 0 ? 'primary.contrastText' : 'text.disabled',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        ml: 0.5,
                      }}
                    >
                      {healthRecordCounts[student.id] || 0}
                    </Box>
                  }
                  sx={{
                    whiteSpace: 'nowrap',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    padding: isMobile ? '4px 8px' : undefined,
                    flex: { xs: '0 0 auto', sm: 1 },
                    '& .MuiButton-endIcon': {
                      marginLeft: 1,
                      marginRight: -0.5,
                    },
                  }}
                >
                  {isMobile ? 'Records' : 'View Health Records'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={isMobile ? null : <Edit {...iconProps} />}
                  onClick={() => navigate(`/student/edit/${student.id}`)}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    padding: isMobile ? '4px 8px' : undefined,
                  }}
                >
                  {isMobile ? 'Edit' : 'Edit'}
                </Button>
                <IconButton
                  color="error"
                  size="small"
                  onClick={(e) => handleDeleteDialogOpen(student, e)}
                  sx={{
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  <Trash2 {...iconProps} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => handleActionsClick(e, student)}
                  sx={{ 
                    display: { xs: 'inline-flex', sm: 'none' },
                    padding: '4px',
                  }}
                >
                  <MoreVertical {...iconProps} />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the student record for{' '}
            <strong>{studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : ''}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionsClose}
        PaperProps={{
          elevation: 2,
          sx: {
            minWidth: 180,
            mt: 0.5
          }
        }}
      >
        <MenuItem 
          onClick={() => handleActionSelect('view')}
          sx={{ py: 0.75 }}
        >
          <ListItemIcon>
            <FileText {...iconProps} />
          </ListItemIcon>
          <ListItemText 
            primary="View Records" 
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
        <MenuItem 
          onClick={() => handleActionSelect('edit')}
          sx={{ py: 0.75 }}
        >
          <ListItemIcon>
            <Edit {...iconProps} />
          </ListItemIcon>
          <ListItemText 
            primary="Edit" 
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
        <MenuItem 
          onClick={() => handleActionSelect('delete')}
          sx={{ py: 0.75 }}
        >
          <ListItemIcon>
            <Trash2 {...iconProps} />
          </ListItemIcon>
          <ListItemText 
            primary="Delete" 
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;
