import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Grow,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import HealthRecordsTable from './HealthRecordsTable';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchHealthRecords = async (studentId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/students/${studentId}/health-records`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setHealthRecords(response.data);
    } catch (error) {
      console.error('Error fetching health records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = async (student) => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setHealthRecords([]);
    } else {
      setSelectedStudent(student);
      await fetchHealthRecords(student.id);
    }
  };

  const handleAddStudent = () => {
    navigate('/students/new');
  };

  const handleEditStudent = (e, studentId) => {
    e.stopPropagation();
    navigate(`/students/edit/${studentId}`);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Student List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddStudent}
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          Add Student
        </Button>
      </Box>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          mb: selectedStudent ? 2 : 0,
          transition: 'margin-bottom 0.3s ease-in-out'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="60px" align="center" />
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  Name
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon color="primary" />
                  Date of Birth
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBoxIcon color="primary" />
                  Gender
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon color="primary" />
                  Grade
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <SettingsIcon color="primary" />
                  Actions
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow
                key={student.id}
                onClick={() => handleRowClick(student)}
                hover
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedStudent?.id === student.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                  '&:hover': {
                    backgroundColor: selectedStudent?.id === student.id 
                      ? 'rgba(25, 118, 210, 0.12)' 
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                  transition: 'background-color 0.2s ease-in-out',
                }}
              >
                <TableCell align="center">
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease-in-out',
                    transform: selectedStudent?.id === student.id ? 'scale(1.1)' : 'scale(1)',
                  }}>
                    <IconButton
                      size="small"
                      sx={{ 
                        color: selectedStudent?.id === student.id ? 'primary.main' : 'action.disabled',
                        transition: 'all 0.2s ease-in-out',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(student);
                      }}
                    >
                      {selectedStudent?.id === student.id ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedStudent?.id === student.id && (
                      <HealthAndSafetyIcon 
                        color="primary" 
                        sx={{ 
                          fontSize: 20,
                          animation: 'pulse 1.5s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 0.6 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.6 },
                          },
                        }} 
                      />
                    )}
                    {`${student.firstName} ${student.lastName}`}
                  </Box>
                </TableCell>
                <TableCell>
                  {format(new Date(student.dateOfBirth), 'MM/dd/yyyy')}
                </TableCell>
                <TableCell>
                  {student.gender}
                </TableCell>
                <TableCell>
                  {student.grade}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title="Edit Student" arrow>
                      <IconButton
                        size="small"
                        onClick={(e) => handleEditStudent(e, student.id)}
                        sx={{
                          border: '2px solid',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          width: '34px',
                          height: '34px',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <CreateRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grow 
        in={selectedStudent !== null} 
        timeout={500}
        style={{ transformOrigin: '0 0 0' }}
      >
        <div>
          {selectedStudent && (
            <>
              <Divider sx={{ my: 2 }} />
              <HealthRecordsTable 
                student={selectedStudent}
                healthRecords={healthRecords}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </Grow>
    </div>
  );
};

export default StudentList;
