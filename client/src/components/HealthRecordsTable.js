import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  Box,
  Typography,
  Tooltip,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import { format } from 'date-fns';
import HealthRecordForm from './HealthRecordForm';

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

const HealthRecordsTable = ({ healthRecords, onEdit, onDelete, student, onRefresh, onAddRecord }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Health Records for {student?.firstName} {student?.lastName}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={onAddRecord}
        >
          Add Record
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Height (cm)</TableCell>
              <TableCell>Weight (kg)</TableCell>
              <TableCell>Temperature (°C)</TableCell>
              <TableCell>Blood Pressure</TableCell>
              <TableCell>BMI</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {healthRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(new Date(record.recordDate), 'MM/dd/yyyy')}</TableCell>
                <TableCell>{record.recordType}</TableCell>
                <TableCell>{record.height}</TableCell>
                <TableCell>{record.weight}</TableCell>
                <TableCell>{record.temperature}</TableCell>
                <TableCell>{record.bloodPressure}</TableCell>
                <TableCell>
                  <BMIDisplay bmi={record.bmi} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Record">
                      <IconButton onClick={() => onEdit(record)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Record">
                      <IconButton onClick={() => onDelete(record)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {healthRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No health records found. Click "Add Record" to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HealthRecordsTable;
