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
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
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
  const [healthRecordCounts, setHealthRecordCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.STUDENTS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudents(response.data);
      
      // Fetch health record counts for all students
      const counts = {};
      for (const student of response.data) {
        const recordsResponse = await axios.get(`${API_ENDPOINTS.HEALTH_RECORDS}/student/${student.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        counts[student.id] = recordsResponse.data.length;
      }
      setHealthRecordCounts(counts);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchHealthRecords = async (studentId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.HEALTH_RECORDS}/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setHealthRecords(response.data);
      // Update count for this student
      setHealthRecordCounts(prev => ({
        ...prev,
        [studentId]: response.data.length
      }));
    } catch (error) {
      console.error('Error fetching health records:', error);
      setHealthRecords([]);
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
    navigate('/student/add');
  };

  const handleEditStudent = (e, studentId) => {
    e.stopPropagation();
    navigate(`/student/edit/${studentId}`);
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
        >
          Add Student
        </Button>
      </Box>

      <TableContainer component={Paper}>
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
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HealthAndSafetyIcon color="primary" />
                  Health Records
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
                sx={{ cursor: 'pointer' }}
              >
                <TableCell align="center">
                  <IconButton size="small">
                    {selectedStudent?.id === student.id ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{format(new Date(student.dateOfBirth), 'MM/dd/yyyy')}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge
                      badgeContent={healthRecordCounts[student.id] || 0}
                      color={healthRecordCounts[student.id] > 0 ? "primary" : "default"}
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.8rem',
                          height: '22px',
                          minWidth: '22px',
                          borderRadius: '11px',
                        }
                      }}
                    >
                      <HealthAndSafetyIcon 
                        color={healthRecordCounts[student.id] > 0 ? "primary" : "disabled"}
                      />
                    </Badge>
                    <Typography variant="body2" color="textSecondary">
                      {healthRecordCounts[student.id] > 0 
                        ? `${healthRecordCounts[student.id]} Records` 
                        : 'No Records'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="Edit Student">
                      <IconButton
                        size="small"
                        onClick={(e) => handleEditStudent(e, student.id)}
                      >
                        <CreateRoundedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add Health Record">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/health-record/add?studentId=${student.id}`);
                        }}
                      >
                        <HealthAndSafetyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedStudent && healthRecords.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Health Records for {selectedStudent.firstName} {selectedStudent.lastName}
          </Typography>
          <HealthRecordsTable
            records={healthRecords}
            studentId={selectedStudent.id}
            isLoading={isLoading}
            onRecordAdded={() => {
              fetchHealthRecords(selectedStudent.id);
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default StudentList;
