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
  Alert,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery,
  Grid,
  Divider
} from '@mui/material';
import { ArrowLeft, Eye } from 'lucide-react';

const GradeStudents = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchStudents();
  }, [grade]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/students`);
      if (grade === 'all') {
        setStudents(response.data);
      } else {
        const filteredStudents = response.data.filter(student => student.grade === parseInt(grade));
        setStudents(filteredStudents);
      }
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

  const StudentCard = ({ student }) => (
    <Card sx={{ mb: 2, width: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {`${student.firstName}, ${student.lastName}`}
        </Typography>
        {grade === 'all' && (
          <Typography color="text.secondary" gutterBottom>
            Grade: {student.grade}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Father's Name:</strong> {student.fatherName || '-'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Address:</strong> {student.address || '-'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Contact:</strong> {student.contactNumber || '-'}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => navigate(`/students/${student.id}`)}
          startIcon={<Eye size={16} />}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );

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
          mb: 3,
          flexWrap: 'wrap',
          gap: 1
        }}>
          <IconButton 
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 1 }}
          >
            <ArrowLeft />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' },
              flex: 1
            }}
          >
            {grade === 'all' ? 'All Students' : `${grade}${getOrdinalSuffix(parseInt(grade))} Grade Students`}
          </Typography>
        </Box>

        {/* Search and Add Student */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
          alignItems: 'stretch'
        }}>
          <TextField
            label="Search Students"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/grade/${grade}/add-student`)}
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' }
            }}
          >
            Add Student
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        ) : (
          <>
            {isMobile ? (
              // Mobile view - Cards
              <Box>
                {filteredStudents.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
                {filteredStudents.length === 0 && (
                  <Typography align="center" sx={{ py: 4 }}>
                    No students found
                  </Typography>
                )}
              </Box>
            ) : (
              // Desktop view - Table
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      {grade === 'all' && <TableCell>Grade</TableCell>}
                      <TableCell>Father's Name</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Contact Number</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{`${student.firstName}, ${student.lastName}`}</TableCell>
                        {grade === 'all' && <TableCell>{student.grade}</TableCell>}
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
                        <TableCell 
                          colSpan={grade === 'all' ? 6 : 5} 
                          align="center"
                          sx={{ py: 4 }}
                        >
                          No students found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default GradeStudents;
