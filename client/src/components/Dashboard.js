import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  TablePagination,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Button,
  TableSortLabel,
  Collapse,
  Chip,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle
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
  Settings as SettingsIcon
} from 'lucide-react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { format } from 'date-fns';
import HealthRecordForm from './HealthRecordForm';

const API_URL = 'http://localhost:5000/api/students';
const HEALTH_RECORDS_API = 'http://localhost:5000/api/health-records';

const iconProps = {
  size: 20,
  strokeWidth: 1.5
};

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [recordsError, setRecordsError] = useState(null);
  const [showRecords, setShowRecords] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstName');
  const [isHealthRecordFormOpen, setIsHealthRecordFormOpen] = useState(false);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again later.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setError(null);
        await axios.delete(`${API_URL}/${studentId}`);
        
        // If the deleted student was selected, clear the selection
        if (selectedStudent?.id === studentId) {
          setSelectedStudent(null);
          setHealthRecords([]);
        }
        
        // Refresh the students list
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        setError('Failed to delete student. Please try again later.');
      }
    }
  };

  const handleViewHealthRecords = async (student, event) => {
    // If event exists (icon click), prevent propagation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (selectedStudent?.id === student.id && showRecords) {
      // Fade out first, then close
      setLoadingRecords(true);
      setTimeout(() => {
        setShowRecords(false);
        setSelectedStudent(null);
        setHealthRecords([]);
        setLoadingRecords(false);
      }, 150);
      return;
    }

    // If different student, fade out current records first
    if (showRecords) {
      setLoadingRecords(true);
      setTimeout(async () => {
        setShowRecords(true);
        setSelectedStudent(student);
        
        try {
          const response = await axios.get(`${HEALTH_RECORDS_API}/student/${student.id}`);
          setHealthRecords(response.data);
        } catch (err) {
          console.error('Error fetching health records:', err);
          setRecordsError('Failed to fetch health records. Please try again.');
          setHealthRecords([]);
        } finally {
          setLoadingRecords(false);
        }
      }, 150);
    } else {
      // First time showing records
      setShowRecords(true);
      setSelectedStudent(student);
      setLoadingRecords(true);
      setRecordsError(null);

      try {
        const response = await axios.get(`${HEALTH_RECORDS_API}/student/${student.id}`);
        setHealthRecords(response.data);
      } catch (err) {
        console.error('Error fetching health records:', err);
        setRecordsError('Failed to fetch health records. Please try again.');
        setHealthRecords([]);
      } finally {
        setLoadingRecords(false);
      }
    }
  };

  const handleDeleteHealthRecord = async (recordId) => {
    try {
      await axios.delete(`${HEALTH_RECORDS_API}/${recordId}`);
      // Update the health records list without refreshing
      setHealthRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
    } catch (err) {
      console.error('Error deleting health record:', err);
      setError('Failed to delete health record. Please try again.');
    }
  };

  const handleEditHealthRecord = (record, e) => {
    e.preventDefault();
    setSelectedHealthRecord(record);
    setIsHealthRecordFormOpen(true);
  };

  const handleAddHealthRecord = (student) => {
    setSelectedStudent(student);
    setSelectedHealthRecord(null);
    setIsHealthRecordFormOpen(true);
  };

  const handleHealthRecordFormClose = () => {
    setIsHealthRecordFormOpen(false);
    setSelectedHealthRecord(null);
  };

  const handleHealthRecordSubmit = async (formData) => {
    try {
      if (selectedHealthRecord) {
        await axios.put(`${HEALTH_RECORDS_API}/${selectedHealthRecord.id}`, formData);
      } else {
        await axios.post(HEALTH_RECORDS_API, { ...formData, studentId: selectedStudent.id });
      }
      
      // Refresh health records
      const response = await axios.get(`${HEALTH_RECORDS_API}/student/${selectedStudent.id}`);
      setHealthRecords(response.data);
      
      // Close form
      handleHealthRecordFormClose();
    } catch (error) {
      console.error('Error saving health record:', error);
      throw error; // Let the form handle the error
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (orderBy === 'name') {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameB.localeCompare(nameA);
    }
    if (orderBy === 'dateOfBirth') {
      return new Date(b.dateOfBirth) - new Date(a.dateOfBirth);
    }
    if (orderBy === 'grade') {
      return Number(b.grade) - Number(a.grade);
    }
    const valueA = (a[orderBy] || '').toLowerCase();
    const valueB = (b[orderBy] || '').toLowerCase();
    return valueB.localeCompare(valueA);
  };

  const sortedStudents = React.useMemo(() => {
    const filtered = students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
    return filtered.sort(getComparator(order, orderBy));
  }, [students, searchQuery, order, orderBy]);

  const handleAddStudent = () => {
    navigate('/student/add');
  };

  const handleEditStudent = (studentId) => {
    navigate(`/student/edit/${studentId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Users {...iconProps} />
        <Box>
          <Typography variant="h4" gutterBottom>
            Student Health Records
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage student information and health records
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search {...iconProps} />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus {...iconProps} />}
          onClick={handleAddStudent}
          sx={{ whiteSpace: 'nowrap', px: 3 }}
        >
          Add Student
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User {...iconProps} />
                      Name
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'dateOfBirth'}
                    direction={orderBy === 'dateOfBirth' ? order : 'asc'}
                    onClick={() => handleRequestSort('dateOfBirth')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarDays {...iconProps} />
                      Date of Birth
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'gender'}
                    direction={orderBy === 'gender' ? order : 'asc'}
                    onClick={() => handleRequestSort('gender')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Users {...iconProps} />
                      Gender
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'grade'}
                    direction={orderBy === 'grade' ? order : 'asc'}
                    onClick={() => handleRequestSort('grade')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GraduationCap {...iconProps} />
                      Grade
                    </Box>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'bloodType'}
                    direction={orderBy === 'bloodType' ? order : 'asc'}
                    onClick={() => handleRequestSort('bloodType')}
                  >
                    Blood Group
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <SettingsIcon {...iconProps} />
                    Actions
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? sortedStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : sortedStudents
              ).map((student) => (
                <TableRow 
                  key={student.id}
                  hover
                  selected={selectedStudent?.id === student.id}
                  onClick={() => handleViewHealthRecords(student)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body1">
                      {`${student.firstName} ${student.lastName}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {student.dateOfBirth ? format(new Date(student.dateOfBirth), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.bloodType}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', minWidth: 120 }}>
                      <IconButton
                        color="primary"
                        onClick={(e) => handleViewHealthRecords(student, e)}
                        title="View Health Records"
                        size="small"
                      >
                        <FileText {...iconProps} />
                      </IconButton>
                      <IconButton
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStudent(student.id);
                        }}
                        title="Edit Student"
                        size="small"
                      >
                        <Edit {...iconProps} />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(student.id);
                        }}
                        title="Delete Student"
                        size="small"
                      >
                        <Trash2 {...iconProps} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {sortedStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Users {...iconProps} />
                      <Typography color="text.secondary">
                        {searchQuery
                          ? 'No students found matching your search'
                          : 'No students found'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[3, 5, 10, 25]}
          component="div"
          count={sortedStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Collapse in={showRecords && selectedStudent !== null} timeout={300}>
        <Paper 
          sx={{ 
            mt: 2, 
            p: 2,
            opacity: loadingRecords ? 0.7 : 1,
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              Health Records for {selectedStudent?.firstName} {selectedStudent?.lastName}
            </Typography>
            <Button
              component={Link}
              to={`/health-records/new/${selectedStudent?.id}`}
              startIcon={<Plus size={20} />}
              variant="contained"
              color="primary"
              onClick={() => handleAddHealthRecord(selectedStudent)}
              disabled={loadingRecords}
            >
              Add Record
            </Button>
          </Box>

          {recordsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {recordsError}
            </Alert>
          )}

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Record Date</TableCell>
                  <TableCell>Record Type</TableCell>
                  <TableCell>Height (cm)</TableCell>
                  <TableCell>Weight (kg)</TableCell>
                  <TableCell>Blood Pressure</TableCell>
                  <TableCell>Temperature (°F)</TableCell>
                  <TableCell>Next Appointment</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FitnessCenterIcon />
                      BMI
                    </Box>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingRecords ? (
                  <TableRow>
                    <TableCell 
                      colSpan={9} 
                      align="center" 
                      sx={{ 
                        height: '200px',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(4px)',
                          zIndex: 1
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <CircularProgress size={32} />
                        <Typography variant="body2" color="text.secondary">
                          Loading health records...
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : healthRecords.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={9} 
                      align="center"
                      sx={{ 
                        height: '200px',
                        position: 'relative'
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          No health records found
                        </Typography>
                        <Button
                          startIcon={<Plus size={16} />}
                          variant="outlined"
                          size="small"
                          onClick={() => handleAddHealthRecord(selectedStudent)}
                        >
                          Add First Record
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  healthRecords.map((record) => (
                    <TableRow 
                      key={record.id}
                      sx={{
                        opacity: loadingRecords ? 0.5 : 1,
                        transition: 'opacity 0.2s ease-in-out'
                      }}
                    >
                      <TableCell>{format(new Date(record.recordDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{record.recordType}</TableCell>
                      <TableCell>{record.height || 'N/A'}</TableCell>
                      <TableCell>{record.weight || 'N/A'}</TableCell>
                      <TableCell>{record.bloodPressure || 'N/A'}</TableCell>
                      <TableCell>{record.temperature || 'N/A'}</TableCell>
                      <TableCell>
                        {record.nextAppointment
                          ? format(new Date(record.nextAppointment), 'MMM d, yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <BMIDisplay bmi={record.bmi} />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <IconButton
                            color="info"
                            size="small"
                            onClick={(e) => handleEditHealthRecord(record, e)}
                          >
                            <Edit size={16} />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteHealthRecord(record.id)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Collapse>

      <Dialog 
        open={isHealthRecordFormOpen} 
        onClose={handleHealthRecordFormClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedHealthRecord ? 'Edit Health Record' : 'Add New Health Record'}
        </DialogTitle>
        <DialogContent>
          <HealthRecordForm
            initialData={selectedHealthRecord}
            studentName={selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : ''}
            onSubmit={handleHealthRecordSubmit}
            onCancel={handleHealthRecordFormClose}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
