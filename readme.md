


# Job Board Backend

This is the backend API for the Job Board application. It handles job postings, applications, user authentication, and more. The application is built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

## Features

- **Job Management**: Employers can post jobs, and candidates can apply for them.
- **Authentication**: Users (employers and candidates) can register, login, and manage their passwords.
- **File Upload**: Candidates can upload resumes when applying for jobs.
- **Job Tracking**: Users can track job applications.
- **Swagger Documentation**: API documentation available via Swagger UI.

## Technologies

- **Node.js**: Runtime environment for the server.
- **Express.js**: Web framework for building the API.
- **TypeScript**: Static typing for better code quality and developer experience.
- **MongoDB**: Database for storing job posts, user data, and applications.
- **Multer**: Middleware for handling file uploads (resumes).
- **JWT (JSON Web Token)**: For user authentication and authorization.
- **Swagger**: For API documentation.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/job-board-backend.git
   cd job-board-backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

   Or, if you're using yarn:
   ```bash
   yarn install
   ```

3. Create a `.env` file at the root of the project and add the necessary environment variables (see **Environment Variables** below).

### Running the Application

- For development:
  ```bash
  npm run dev
  ```

  This will start the server with `nodemon`, automatically restarting on code changes.

- For production:
  ```bash
  npm run start
  ```

  This will start the server using `ts-node`.

### API Documentation

You can access the Swagger UI for API documentation at:
```
http://localhost:5000/api-docs
```

### Environment Variables

You need to set the following environment variables in your `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-board
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d
REDIS_HOST=localhost
REDIS_PORT=6379
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_pass
```

- **PORT**: The port on which the server will run.
- **MONGO_URI**: The MongoDB connection string.
- **JWT_SECRET**: The secret key for signing JSON Web Tokens.
- **JWT_EXPIRATION**: The expiration time for JWT tokens (e.g., `1d`).
- **REDIS_HOST** and **REDIS_PORT**: Redis server for session storage or other caching purposes.
- **MAIL_HOST**, **MAIL_PORT**, **MAIL_USER**, **MAIL_PASS**: Configuration for sending emails (e.g., for password reset functionality).

### Running Tests

To run the tests, use the following command:

```bash
npm run test
```

Note: The current project does not include automated tests, but you can add them later based on your requirements.

## Routes

### Authentication Routes

- **POST /api/auth/register**: Register a new user (employer or candidate).
- **POST /api/auth/login**: Login an existing user.
- **POST /api/auth/refresh**: Refresh the access token.
- **POST /api/auth/forgot-password**: Request a password reset token.
- **POST /api/auth/reset-password**: Reset the password using the reset token.

### Job Routes

- **POST /api/jobs/post**: Post a new job (employers only).
- **GET /api/jobs**: Get a list of jobs with optional filters (location, type, skills).
- **GET /api/jobs/{id}**: Get a job by its ID.
- **POST /api/jobs/{id}/apply**: Apply for a job with a resume (candidates only).
- **GET /api/jobs/applications**: Get a list of job applications for the authenticated user.
- **PUT /api/jobs/applications/status**: Update the status of a job application (employers only).
