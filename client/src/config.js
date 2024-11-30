const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? '/api'  // In production, use relative path
    : 'http://localhost:5000/api'  // In development, use full URL
};

export default config;
