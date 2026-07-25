# Task Manager

Full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) using TypeScript and Ant Design.

## Features

- User registration & login with JWT authentication
- Board view with drag-and-drop task management
- Task CRUD with title, description, status, priority, due date
- Instant search by title
- Filter by priority
- File attachments on tasks
- Pagination (10 tasks per page)
- Responsive design

## Tech Stack

**Backend:**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication (bcryptjs)
- Multer for file uploads
- express-validator for input validation

**Frontend:**
- React 18 + TypeScript
- Ant Design 5 UI library
- @hello-pangea/dnd (drag and drop)
- React Router v6
- Axios with JWT interceptor

## Project Structure

```
backend/
  src/
    config/       - DB connection, multer config
    controllers/  - Request handlers
    middleware/   - JWT auth middleware
    models/       - Mongoose schemas (User, Task)
    routes/       - Express routes
    services/     - Business logic
    validations/  - express-validator rules
    server.ts     - App entry point

frontend/
  src/
    api/          - Axios instance with auth interceptor
    components/   - React components (Board, TaskCard, etc.)
    context/      - Auth context provider
    types/        - TypeScript interfaces
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed   # Populate database with sample data
npm run dev    # Start dev server on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm start      # Start dev server on port 3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/tasks | List tasks (search, filter, paginate) |
| GET | /api/tasks/:id | Get single task |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| PATCH | /api/tasks/:id/status | Update task status (drag & drop) |
| DELETE | /api/tasks/:id | Delete task |

### Query Parameters (GET /api/tasks)

| Param | Type | Description |
|-------|------|-------------|
| search | string | Search by title (case-insensitive) |
| priority | string | Filter: low, medium, high |
| sortBy | string | Sort field: createdAt, dueDate, title, priority |
| order | string | asc or desc |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, max: 50) |

## Testing

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```
