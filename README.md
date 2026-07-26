# Task Manager

Full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) using TypeScript and Ant Design.

## Features

- User registration & login with JWT authentication (bcrypt password hashing)
- Board view with drag-and-drop task management
- Task CRUD with title, description, status, priority, due date
- Instant search by title (case-insensitive)
- Filter by status and priority
- File attachments on tasks
- Pagination (10 tasks per page, sortable)
- Responsive design
- Loading, error, empty-state, and validation feedback

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
├── backend/
│   └── src/
│       ├── __tests__/       — Jest test suites (auth, tasks, middleware)
│       ├── config/           — DB connection, multer config
│       ├── controllers/      — Request handlers (auth, tasks)
│       ├── middleware/       — JWT auth middleware
│       ├── models/           — Mongoose schemas (User, Task)
│       ├── routes/           — Express routes (auth, tasks)
│       ├── services/         — Business logic layer
│       ├── utils/            — Error helper
│       ├── validations/      — express-validator rules
│       ├── seed.ts           — Database seeder (3 users, 17 tasks)
│       └── server.ts         — App entry point
├── frontend/
│   └── src/
│       ├── api/              — Axios instance with JWT interceptor
│       ├── components/       — React components + tests
│       ├── context/          — Auth context provider
│       ├── types/            — TypeScript interfaces
│       ├── App.tsx           — Root component with routing
│       └── index.tsx         — Entry point
├── Task-Manager.postman_collection.json
└── README.md
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
| status | string | Filter: todo, in_progress, done |
| priority | string | Filter: low, medium, high |
| sortBy | string | Sort field: createdAt, dueDate, title, priority |
| order | string | asc or desc |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, max: 50) |

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see Environment Variables below)
npm run seed   # Populate database with sample data
npm run dev    # Start dev server on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm start      # Start dev server on port 3000
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `BCRYPT_SALT_ROUNDS` | Password hash rounds | `10` |
| `REACT_APP_API_URL` | Backend API URL (frontend) | `http://localhost:5000/api` |

## Testing

### Backend (28 tests)

```bash
cd backend
npm test
```

### Frontend (23 tests)

```bash
cd frontend
npm test
```

## Test Accounts

All users share the password `password123`.

| Name | Email | Notes |
|------|-------|-------|
| Ammar | ammar@example.com | 10 tasks across all statuses, includes overdue tasks |
| Alice | alice@example.com | 4 tasks |
| Bob | bob@example.com | 3 tasks |

Run `npm run seed` to populate the database.

## Postman Collection

Import `Task-Manager.postman_collection.json` into Postman. Variables (`baseUrl`, `token`) are auto-chained for easy testing.
