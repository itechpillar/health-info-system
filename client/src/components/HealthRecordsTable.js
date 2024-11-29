import React from 'react';
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
  CircularProgress,
  Fade,
  IconButton,
  Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';

const HealthRecordsTable = ({ student, healthRecords, isLoading }) => {
  const navigate = useNavigate();

  if (!student) {
    return null;
  }

  const handleAddHealthRecord = (e) => {
    e.stopPropagation();
    navigate(`/health-records/new?studentId=${student.id}`);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 1,
          p: 2,
          boxShadow: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIndIcon />
            <Typography variant="h6" component="div">
              Health Records for {student.firstName} {student.lastName}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleAddHealthRecord}
            startIcon={<AddCircleOutlineIcon />}
            sx={{ 
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Add Health Record
          </Button>
        </Box>
        
        <TableContainer 
          component={Paper}
          sx={{
            position: 'relative',
            minHeight: '200px',
            opacity: isLoading ? 0.7 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon color="primary" />
                    Record Date
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon color="primary" />
                    Record Type
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HeightIcon color="primary" />
                    Height (cm)
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonitorWeightIcon color="primary" />
                    Weight (kg)
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteIcon color="primary" />
                    Blood Pressure
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeviceThermostatIcon color="primary" />
                    Temperature (°C)
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon color="primary" />
                    Next Appointment
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
              {healthRecords && healthRecords.length > 0 ? (
                healthRecords.map((record) => (
                  <TableRow 
                    key={record.id}
                    hover
                    sx={{
                      transition: 'background-color 0.2s ease-in-out',
                    }}
                  >
                    <TableCell>
                      {format(new Date(record.recordDate), 'MM/dd/yyyy')}
                    </TableCell>
                    <TableCell>
                      {record.recordType}
                    </TableCell>
                    <TableCell>
                      {record.height || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {record.weight || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {record.bloodPressure || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {record.temperature || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {record.nextAppointment 
                        ? format(new Date(record.nextAppointment), 'MM/dd/yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Edit Health Record" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/health-records/edit/${record.id}`);
                            }}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="textSecondary" sx={{ py: 4 }}>
                      No health records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );
};

export default HealthRecordsTable;
