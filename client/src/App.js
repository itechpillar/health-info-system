import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from './components/Layout/MainLayout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HealthRecordList from './components/HealthRecordList';
import HealthRecordForm from './components/HealthRecordForm';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import GradeStudents from './components/GradeStudents';
import StudentDetails from './components/StudentDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/students/add"
            element={
              <PrivateRoute>
                <MainLayout>
                  <StudentForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <StudentForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/students/:id/health-records"
            element={
              <PrivateRoute>
                <MainLayout>
                  <HealthRecordList />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/students/:studentId/health-record/add"
            element={
              <PrivateRoute>
                <MainLayout>
                  <HealthRecordForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/students/:studentId/health-record/edit/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <HealthRecordForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/grade/:grade"
            element={
              <PrivateRoute>
                <MainLayout>
                  <GradeStudents />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <StudentDetails />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
