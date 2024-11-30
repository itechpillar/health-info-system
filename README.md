# Health Information Management System

A web application for managing student health records using React, Node.js, and PostgreSQL.

## Features

- Create, read, update, and delete student health records
- Store comprehensive health information including:
  - Personal details
  - Medical conditions
  - Allergies
  - Medications
  - Emergency contacts
  - Checkup history
- Modern, responsive user interface
- RESTful API backend
- PostgreSQL database for persistent storage

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Setup

1. Clone the repository
2. Create a PostgreSQL database named `health_records`

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with your database configuration:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/health_records
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

- GET `/api/health-records` - Get all health records
- GET `/api/health-records/:id` - Get a specific health record
- POST `/api/health-records` - Create a new health record
- PUT `/api/health-records/:id` - Update a health record
- DELETE `/api/health-records/:id` - Delete a health record

## Deployment on Render

### Prerequisites
1. Create a [Render](https://render.com) account
2. Install [Node.js](https://nodejs.org/) (v14 or higher)
3. Install [PostgreSQL](https://www.postgresql.org/) (v12 or higher)

### Environment Variables
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Required environment variables for production:
- `NODE_ENV`: Set to 'production'
- `DATABASE_URL`: PostgreSQL connection string (provided by Render)
- `JWT_SECRET`: Secret key for JWT authentication
- `REACT_APP_API_URL`: URL of your deployed API

### Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Create a new Web Service for the API:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Add environment variables from `.env`

4. Create a new Static Site for the client:
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`
   - Add environment variables from `.env`

5. Create a PostgreSQL database on Render
   - Connect it to your API service
   - The database URL will be automatically added to your environment variables

### Local Development

1. Install dependencies:
```bash
npm run install-all
```

2. Start development servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:3000

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `client/build` directory.

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express
  - Sequelize (ORM)
  - PostgreSQL
  - JSON Web Token (for future authentication)

## Security Considerations

- Input validation and sanitization
- CORS enabled
- Environment variables for sensitive data
- Prepared statements for database queries (via Sequelize)

## Future Enhancements

- User authentication and authorization
- Role-based access control
- File upload for medical documents
- Advanced search and filtering
- Export health records to PDF
- Email notifications for important updates
