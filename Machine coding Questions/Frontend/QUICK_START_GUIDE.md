# Quick Start Guide - MERN App

## Prerequisites

- Node.js installed
- MongoDB running on localhost:27017
- MongoDB database: `placemetJourney`

---

## Starting the Application

### 1. Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### 2. Start the Frontend Development Server

In another terminal:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## First Time Setup

### Database Will Auto-Create Collections

MongoDB will automatically create the following collections when you make your first API calls:
- `users` - User accounts
- `tasks` - Task management data
- `notes` - User notes
- `lectures` - Available lectures

---

## Testing the Application

### 1. Register a New User

1. Navigate to http://localhost:5173
2. Click on any protected feature (Tasks, Notes, or Lectures)
3. Click "Don't have an account? Sign Up"
4. Enter:
   - Email: `test@example.com`
   - Password: `password123` (minimum 6 characters)
   - Confirm Password: `password123`
5. Click "Sign Up"

### 2. Test Task Management

1. Navigate to `/tasks` page
2. Create a new task:
   - Title: "Learn MongoDB"
   - Description: "Study MongoDB basics"
   - Due Date: Select a future date
   - Priority: "Medium"
   - Category: "Learning"
3. Click "Add Task"
4. Task should appear in the list
5. Click the circle icon to mark as complete
6. Click trash icon to delete

### 3. Test Notes Management

1. Navigate to `/notes` page
2. Your notes will appear (if any exist)
3. Search and filter by category

### 4. Test Lectures

1. Navigate to `/lectures` page
2. Browse available lectures
3. Filter by category
4. Search for specific lectures

### 5. Test Logout

1. Click on your user profile or logout button in Navbar
2. You'll be logged out
3. localStorage token is removed
4. Try accessing Tasks/Notes - should show login prompt

---

## API Testing with Postman/Curl

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "test@example.com"
  }
}
```

### Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Study React",
    "description": "Learn React hooks",
    "priority": "high",
    "category": "Learning"
  }'
```

### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"completed": true}'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**
1. Ensure MongoDB is running: `mongod` in a terminal
2. Check if port 27017 is available
3. Verify connection string in `.env` file

### Issue: Backend Port 5000 Already in Use

**Solution:**
1. Change port in backend/.env: `PORT=5001`
2. Update frontend API_BASE_URL accordingly

### Issue: CORS Error

**Solution:**
- CORS is already enabled in backend
- Make sure backend is running on correct port
- Clear browser cache

### Issue: "Token is not valid"

**Solution:**
1. Log out and log in again
2. Clear localStorage: `localStorage.clear()` in browser console
3. Refresh the page

### Issue: 401 Unauthorized

**Solution:**
1. Token might be expired (7 days)
2. Log in again to get new token
3. Ensure token is sent in Authorization header as: `Bearer <token>`

---

## Data Persistence

- All user data is saved in MongoDB
- Data persists across:
  - Page refreshes
  - Browser restarts
  - Different sessions
  - Multiple years

To view data in MongoDB:
```bash
mongosh
use placemetJourney
db.tasks.find()
db.notes.find()
db.users.find()
db.lectures.find()
```

---

## Production Deployment Notes

Before deploying to production:

1. Change JWT_SECRET in `.env` to a strong random string
2. Add environment variable NODE_ENV=production
3. Set proper CORS origins
4. Use a cloud MongoDB instance (MongoDB Atlas)
5. Use HTTPS for all connections
6. Implement rate limiting
7. Add input validation on both frontend and backend
8. Add error logging
9. Add user email verification
10. Implement refresh tokens

---

## Support & Debugging

### Enable Debug Logging

Add to backend/index.js:
```javascript
mongoose.set('debug', true);
```

### Check Network Requests

In browser DevTools:
1. Go to Network tab
2. Make API request
3. Check request headers and response
4. Look for Authorization header

### View Console Errors

Frontend errors: Browser DevTools Console
Backend errors: Terminal where you ran `npm start`

---

## Next Steps

1. Customize the theme colors
2. Add more task categories
3. Implement note editing
4. Add task priority filtering
5. Set up CI/CD pipeline
6. Deploy to cloud (Vercel for frontend, Heroku/Railway for backend)

---

For more details, see `MERN_SETUP_COMPLETE.md`
