import React, { memo } from 'react';
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
  Chip,
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
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Edit, Trash2, Plus } from 'lucide-react';

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

const BMIDisplay = memo(({ bmi }) => {
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
});

const TableHeader = memo(() => (
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
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FitnessCenterIcon color="primary" />
          BMI
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
));

const LoadingState = memo(({ message = 'Loading health records...' }) => (
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
          {message}
        </Typography>
      </Box>
    </TableCell>
  </TableRow>
));

const EmptyState = memo(({ onAddRecord }) => (
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
          onClick={onAddRecord}
        >
          Add First Record
        </Button>
      </Box>
    </TableCell>
  </TableRow>
));

const HealthRecordRow = memo(({ record, onEdit, onDelete, isLoading }) => (
  <TableRow 
    sx={{
      opacity: isLoading ? 0.5 : 1,
      transition: 'opacity 0.2s ease-in-out'
    }}
  >
    <TableCell>{format(new Date(record.recordDate), 'MM/dd/yyyy')}</TableCell>
    <TableCell>{record.recordType}</TableCell>
    <TableCell>{record.height || 'N/A'}</TableCell>
    <TableCell>{record.weight || 'N/A'}</TableCell>
    <TableCell>{record.bloodPressure || 'N/A'}</TableCell>
    <TableCell>{record.temperature || 'N/A'}</TableCell>
    <TableCell>
      {record.nextAppointment
        ? format(new Date(record.nextAppointment), 'MM/dd/yyyy')
        : 'N/A'}
    </TableCell>
    <TableCell>
      <BMIDisplay bmi={record.bmi} />
    </TableCell>
    <TableCell align="center">
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <IconButton
          color="info"
          size="small"
          onClick={(e) => onEdit(record, e)}
        >
          <Edit size={16} />
        </IconButton>
        <IconButton
          color="error"
          size="small"
          onClick={() => onDelete(record.id)}
        >
          <Trash2 size={16} />
        </IconButton>
      </Box>
    </TableCell>
  </TableRow>
));

const HealthRecordsTable = ({
  student,
  healthRecords,
  isLoading,
  onEdit,
  onDelete,
  onAddRecord
}) => {
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
            <TableHeader />
            <TableBody>
              {isLoading ? (
                <LoadingState />
              ) : healthRecords.length === 0 ? (
                <EmptyState onAddRecord={handleAddHealthRecord} />
              ) : (
                healthRecords.map((record) => (
                  <HealthRecordRow
                    key={record.id}
                    record={record}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isLoading={isLoading}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );
};

export default memo(HealthRecordsTable);
