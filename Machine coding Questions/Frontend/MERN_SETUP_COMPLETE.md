# MERN App Setup - Complete

## What Has Been Implemented

### Backend Setup (Node.js + Express + MongoDB)

**Location:** `backend/` directory

#### Models Created:
1. **User.js** - User authentication model with email and password (hashed with bcryptjs)
2. **Task.js** - Task model with user reference, title, description, due date, priority, and category
3. **Note.js** - Note model for user-specific notes with title, content, and category
4. **Lecture.js** - Lecture model with title, instructor, URL, duration, category, and savedBy array

#### API Routes:

**Authentication (`/api/auth`)**
- `POST /register` - User registration with email/password
- `POST /login` - User login, returns JWT token
- `GET /me` - Get current user info (requires authentication)
- Token expiry: 7 days

**Tasks (`/api/tasks`)**
- `GET /` - Get all tasks for authenticated user
- `GET /:id` - Get specific task
- `POST /` - Create new task
- `PUT /:id` - Update task (can toggle completed status)
- `DELETE /:id` - Delete task
- All endpoints require JWT authentication

**Notes (`/api/notes`)**
- `GET /` - Get all notes for authenticated user
- `GET /:id` - Get specific note
- `POST /` - Create new note
- `PUT /:id` - Update note
- `DELETE /:id` - Delete note
- All endpoints require JWT authentication

**Lectures (`/api/lectures`)**
- `GET /` - Get all lectures (public)
- `GET /saved` - Get lectures saved by user (requires auth)
- `POST /:id/save` - Save lecture for user (requires auth)
- `POST /:id/unsave` - Unsave lecture (requires auth)
- `POST /` - Create lecture (admin)

#### Database:
- **Database Name:** placemetJourney
- **Connection String:** mongodb://localhost:27017/placemetJourney
- **Collections:** Users, Tasks, Notes, Lectures

---

### Frontend Setup (React + TypeScript)

**Location:** `src/` directory

#### Authentication System:
1. **AuthContext.tsx** - Centralized authentication state management
   - `user` - Current logged-in user
   - `isLoggedIn` - Boolean flag
   - `loading` - Loading state
   - `showAuthModal` - Modal visibility state
   - `login(email, password)` - Login function
   - `register(email, password)` - Registration function
   - `logout()` - Logout function
   - `useAuth()` - Custom hook to access auth context

2. **AuthModal.tsx** - Modal for login/signup
   - Toggle between Login and Sign Up modes
   - Email validation
   - Password confirmation for signup
   - Error handling and loading states
   - Stores JWT token in localStorage

#### Updated Pages:
1. **Tasks.tsx** - User-specific task management
   - Fetch tasks from backend API
   - Create new tasks
   - Toggle task completion
   - Delete tasks
   - Filter by status (All, Pending, Completed)
   - Required authentication - shows login prompt if not logged in
   - Display task metadata (priority, category, due date)

2. **Notes.tsx** - User-specific note management
   - Fetch user's notes from backend
   - Search and filter by category
   - Required authentication
   - Displays notes in grid layout

3. **Lectures.tsx** - Browse available lectures
   - Fetch all lectures from backend
   - Search functionality
   - Filter by category
   - Shows login modal when clicking lecture if not authenticated

#### Updated Components:
1. **TaskForm.tsx** - Form to create new tasks
   - Updated to accept `onAdd` callback
   - Supports priority selection (low, medium, high)
   - Supports category selection
   - Optional due date
   - Error handling with loading state

2. **AuthContext.tsx** - Exports `useAuth` hook
   - All pages can use `useAuth()` to access authentication

#### App.tsx - Main App Component
- Integrated AuthModal globally
- Wraps all routes with AuthProvider
- Displays modal when `showAuthModal` is true

---

## How to Run

### Backend
```bash
cd backend
npm start
```
- Server runs on http://localhost:5000
- MongoDB must be running on localhost:27017

### Frontend
```bash
npm run dev
```
- Frontend runs on http://localhost:5173 (Vite default)

---

## Data Flow

### User Registration/Login:
1. User clicks any restricted feature (Tasks, Notes, or Lectures)
2. If not logged in, AuthModal appears
3. User enters email and password
4. Frontend sends POST request to `/api/auth/register` or `/api/auth/login`
5. Backend returns JWT token
6. Frontend stores token in localStorage
7. Token is automatically sent in Authorization header for subsequent requests

### Task Management:
1. User logs in
2. Frontend fetches tasks via GET `/api/tasks` with token
3. User can create new task via POST `/api/tasks`
4. User can toggle completion via PUT `/api/tasks/:id`
5. User can delete task via DELETE `/api/tasks/:id`
6. All data is stored in MongoDB with user reference

### Notes Management:
1. User logs in
2. Frontend fetches notes via GET `/api/notes` with token
3. All notes are user-specific due to MongoDB user field

### Lectures:
1. Lectures can be viewed without authentication
2. User can save lectures if logged in
3. Saved lectures are stored in `savedBy` array on lecture document

---

## Token Management

- **Stored in:** localStorage under key "token"
- **Format:** JWT token
- **Expiry:** 7 days
- **Sent as:** Bearer token in Authorization header
- Example: `Authorization: Bearer <token>`

---

## Security Features

1. **Password Hashing:** Bcryptjs (10 salt rounds)
2. **JWT Authentication:** All protected routes verify JWT token
3. **CORS Enabled:** Frontend can communicate with backend
4. **User Isolation:** Each user can only access their own data
5. **Token Verification:** Token checked on every protected request

---

## Testing Checklist

- [ ] Backend server starts successfully
- [ ] MongoDB connection successful
- [ ] User registration works
- [ ] User login works
- [ ] JWT token stored in localStorage
- [ ] Tasks can be created
- [ ] Tasks can be updated
- [ ] Tasks can be deleted
- [ ] Tasks are user-specific
- [ ] Notes can be fetched
- [ ] Notes are user-specific
- [ ] Lectures can be viewed
- [ ] Authentication modal shows for non-logged-in users
- [ ] User logout works
- [ ] Data persists across page reloads

---

## Data Persistence

All data is stored in MongoDB:
- **User Accounts:** Email, hashed password, timestamps
- **Tasks:** All task data with user reference
- **Notes:** All notes with user reference
- **Lectures:** Shared lectures with user save references

Data is preserved across years and sessions due to MongoDB persistence.

---

## File Structure

```
root/
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── .env
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Note.js
│   │   └── Lecture.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── notes.js
│   │   └── lectures.js
│   └── node_modules/
│
└── frontend/ (src/)
    ├── App.tsx
    ├── context/
    │   └── AuthContext.tsx
    ├── pages/
    │   ├── Tasks.tsx
    │   ├── Notes.tsx
    │   ├── Lectures.tsx
    │   └── ...
    ├── components/
    │   ├── AuthModal.tsx
    │   ├── TaskForm.tsx
    │   ├── NoteCard.tsx
    │   ├── LectureCard.tsx
    │   └── ...
    └── ...
```

---

## Next Steps (Optional Enhancements)

1. Add Edit task functionality
2. Add Edit note functionality
3. Add bulk operations for tasks
4. Add export/download notes as PDF
5. Add lecture video player integration
6. Add progress statistics and charts
7. Add email verification for registration
8. Add password reset functionality
9. Add admin panel for lecture management
10. Add notification system
