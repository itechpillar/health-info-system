import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Collapse
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
  SettingsIcon
} from 'lucide-react';
import { format } from 'date-fns';

const API_URL = 'http://localhost:5000/api/students';
const HEALTH_RECORDS_API = 'http://localhost:5000/api/health-records';

const iconProps = {
  size: 20,
  strokeWidth: 1.5
};

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstName');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
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

  const handleViewRecords = async (e, student) => {
    e.stopPropagation(); // Prevent row click event
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setHealthRecords([]);
      return;
    }
    
    setLoadingRecords(true);
    setSelectedStudent(student);
    
    try {
      const response = await axios.get(`${HEALTH_RECORDS_API}/student/${student.id}`);
      setHealthRecords(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching health records:', error);
      setError('Failed to fetch health records');
      setHealthRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleRowClick = async (student) => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setHealthRecords([]);
      return;
    }
    
    setLoadingRecords(true);
    setSelectedStudent(student);
    
    try {
      const response = await axios.get(`${HEALTH_RECORDS_API}/student/${student.id}`);
      setHealthRecords(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching health records:', error);
      setError('Failed to fetch health records');
      setHealthRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this health record?')) {
      return;
    }
    
    try {
      setError(null);
      await axios.delete(`${HEALTH_RECORDS_API}/${recordId}`);
      
      // Only update the health records array, don't refetch
      setHealthRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
    } catch (error) {
      console.error('Error deleting health record:', error);
      setError('Failed to delete health record. Please try again later.');
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

  const handleViewHealthRecords = (studentId) => {
    navigate(`/student/${studentId}/health-records`);
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
                  onClick={() => handleRowClick(student)}
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
                        onClick={(e) => handleViewRecords(e, student)}
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

      {selectedStudent && (
        <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden', borderRadius: 2 }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="h2">
              Health Records for {selectedStudent.firstName} {selectedStudent.lastName}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus />}
              onClick={() => navigate(`/health-records/add/${selectedStudent.id}`)}
            >
              Add Health Record
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Record Date</TableCell>
                  <TableCell>Record Type</TableCell>
                  <TableCell>Height (cm)</TableCell>
                  <TableCell>Weight (kg)</TableCell>
                  <TableCell>Blood Pressure</TableCell>
                  <TableCell>Temperature (°F)</TableCell>
                  <TableCell>Next Appointment</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingRecords ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : healthRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No health records found
                    </TableCell>
                  </TableRow>
                ) : (
                  healthRecords.map((record) => (
                    <TableRow key={record.id}>
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
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => navigate(`/health-records/edit/${record.id}`)}
                          >
                            <Edit {...iconProps} />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            <Trash2 {...iconProps} />
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
      )}
    </Container>
  );
};

export default Dashboard;
