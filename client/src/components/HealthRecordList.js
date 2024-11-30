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
  Button
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

const HealthRecordList = () => {
  const { id: studentId } = useParams();
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [healthRecords, setHealthRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId) {
      fetchSingleStudent();
    } else {
      fetchAllStudents();
    }
  }, [studentId]);

  const fetchSingleStudent = async () => {
    try {
      setLoading(true);
      const [studentResponse, recordsResponse] = await Promise.all([
        axios.get(`${API_URL}/${studentId}`),
        axios.get(`${HEALTH_RECORDS_API_URL}/student/${studentId}`)
      ]);
      
      setCurrentStudent(studentResponse.data);
      setHealthRecords({ [studentId]: recordsResponse.data });
      setError(null);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to fetch student health records');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      
      if (!Array.isArray(response.data)) {
        setError('Invalid data format received');
        return;
      }
      
      setStudents(response.data);
      
      const healthRecordsData = {};
      for (const student of response.data) {
        try {
          const recordsResponse = await axios.get(`${HEALTH_RECORDS_API_URL}/student/${student.id}`);
          healthRecordsData[student.id] = recordsResponse.data;
        } catch (err) {
          console.error(`Error fetching health records for student ${student.id}:`, err);
          healthRecordsData[student.id] = [];
        }
      }
      setHealthRecords(healthRecordsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId, studentId) => {
    if (window.confirm('Are you sure you want to delete this health record?')) {
      try {
        await axios.delete(`${HEALTH_RECORDS_API_URL}/${recordId}`);
        // Refresh the health records for this student
        const recordsResponse = await axios.get(`${HEALTH_RECORDS_API_URL}/student/${studentId}`);
        setHealthRecords(prev => ({
          ...prev,
          [studentId]: recordsResponse.data
        }));
      } catch (error) {
        console.error('Error deleting health record:', error);
        setError('Failed to delete health record');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading health records...</Typography>
      </Box>
    );
  }

  const renderHealthRecordsTable = (studentId, records = []) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Record Date</TableCell>
            <TableCell>Record Type</TableCell>
            <TableCell>Height (cm)</TableCell>
            <TableCell>Weight (kg)</TableCell>
            <TableCell>Blood Pressure</TableCell>
            <TableCell>Temperature (°C)</TableCell>
            <TableCell>Medical Notes</TableCell>
            <TableCell>Next Appointment</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length > 0 ? (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{formatDate(record.recordDate)}</TableCell>
                <TableCell>{record.recordType}</TableCell>
                <TableCell>{record.height || 'N/A'}</TableCell>
                <TableCell>{record.weight || 'N/A'}</TableCell>
                <TableCell>{record.bloodPressure || 'N/A'}</TableCell>
                <TableCell>{record.temperature || 'N/A'}</TableCell>
                <TableCell>{record.medicalNotes || 'N/A'}</TableCell>
                <TableCell>{formatDate(record.nextAppointment)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/health-records/edit/${record.id}`)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(record.id, studentId)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No health records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {studentId && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/students')}
              variant="outlined"
            >
              Back to Students
            </Button>
          )}
          <Typography variant="h5">
            {currentStudent 
              ? `Health Records - ${currentStudent.firstName} ${currentStudent.lastName}`
              : 'All Health Records'
            }
          </Typography>
        </Box>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate('/health-records/new')}
        >
          <AddIcon />
        </Fab>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {studentId ? (
        <Box sx={{ mb: 4 }}>
          {renderHealthRecordsTable(studentId, healthRecords[studentId])}
        </Box>
      ) : (
        students.map((student) => (
          <Box key={student.id} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {student.firstName} {student.lastName}
            </Typography>
            {renderHealthRecordsTable(student.id, healthRecords[student.id])}
          </Box>
        ))
      )}

      <TablePagination
        component="div"
        count={students.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default HealthRecordList;
