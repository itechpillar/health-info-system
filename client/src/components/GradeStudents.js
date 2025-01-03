import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowLeft, Eye } from 'lucide-react';

const GradeStudents = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [grade]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/students`);
      const filteredStudents = response.data.filter(student => student.grade === parseInt(grade));
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      (student.fatherName && student.fatherName.toLowerCase().includes(searchLower))
    );
  });

  const getOrdinalSuffix = (grade) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = grade % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

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
      <Box sx={{ marginLeft: '250px', width: 'calc(100% - 250px)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="h4" component="h1">
            {grade}{getOrdinalSuffix(parseInt(grade))} Grade Students
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            label="Search Students"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/grade/${grade}/add-student`)}
            sx={{ ml: 2 }}
          >
            Add Student
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Filter by student or father's name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
        />

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Father's Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                    <TableCell>{student.fatherName || '-'}</TableCell>
                    <TableCell>{student.address || '-'}</TableCell>
                    <TableCell>{student.contactNumber || '-'}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => navigate(`/students/${student.id}`)}
                        startIcon={<Eye size={18} />}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default GradeStudents;
