// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Use the environment variable if set, otherwise use the appropriate default
const API_BASE_URL = isProduction 
  ? 'https://health-records-api.onrender.com'
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  STUDENTS: `${API_BASE_URL}/api/students`,
  HEALTH_RECORDS: `${API_BASE_URL}/api/health-records`,
  AUTH: `${API_BASE_URL}/api/auth`
};

export default API_ENDPOINTS;
