# TaskFlow — MERN Task Manager with Kanban

A full-stack task manager with drag-and-drop Kanban board, authentication, and deadlines.

## Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 18 + Vite               |
| Backend   | Node.js + Express             |
| Database  | MongoDB + Mongoose            |
| Auth      | JWT + bcryptjs                |
| Drag&Drop | @hello-pangea/dnd             |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── models/         # User, Task schemas
│   ├── routes/         # auth.js, tasks.js
│   ├── middleware/     # auth.js (JWT)
│   ├── server.js       # Express app entry
│   ├── .env.example    # Copy to .env and fill in values
│   └── package.json
└── frontend/
    ├── src/
│   ├── components/  # TaskCard, TaskModal
│   ├── context/     # AuthContext
│   ├── pages/       # AuthPage, BoardPage
│   ├── App.jsx
│   └── main.jsx
    ├── index.html
    └── package.json
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally OR a MongoDB Atlas URI

### 2. Backend Setup

```bash
cd backend
npm install

# Create your .env file
cp .env.example .env
# Edit .env with your values (see below)

npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_min_32_chars

CLIENT_URL=http://localhost:5173
```

---

## Features

- ✅ Register & Login with JWT auth
- ✅ Create tasks with title, description, deadline, priority
- ✅ Drag & drop between To Do → In Progress → Done columns
- ✅ Filter tasks by priority (High / Medium / Low)
- ✅ Stats dashboard (total, in progress, done, overdue)
- ✅ Overdue & "due soon" visual indicators on cards
- ✅ Fully responsive design

---

## API Endpoints

| Method | Route                  | Description           |
|--------|------------------------|-----------------------|
| POST   | /api/auth/register     | Register user         |
| POST   | /api/auth/login        | Login, get token      |
| GET    | /api/tasks             | Get all user tasks    |
| POST   | /api/tasks             | Create task           |
| PUT    | /api/tasks/:id         | Update task           |
| DELETE | /api/tasks/:id         | Delete task           |
| PUT    | /api/tasks/bulk/reorder| Bulk reorder (Kanban) |
