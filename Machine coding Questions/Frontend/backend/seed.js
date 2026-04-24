require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const Note = require('./models/Note');
const Lecture = require('./models/Lecture');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await Note.deleteMany({});
    await Lecture.deleteMany({});
    console.log('Cleared existing data');

    // Create sample user
    const user = new User({
      email: 'demo@example.com',
      password: 'demo@123',
    });
    await user.save();
    console.log('Sample user created:', user.email);

    // Create sample tasks
    const tasks = await Task.insertMany([
      {
        user: user._id,
        title: 'Learn React Hooks',
        description: 'Master useState, useEffect, useContext',
        priority: 'high',
        category: 'Learning',
        completed: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        user: user._id,
        title: 'Fix Authentication Bug',
        description: 'Fix the JWT token expiration issue',
        priority: 'high',
        category: 'Bug Fix',
        completed: false,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        user: user._id,
        title: 'Review Pull Requests',
        description: 'Review and merge pending PRs',
        priority: 'medium',
        category: 'Review',
        completed: true,
        dueDate: new Date(),
      },
      {
        user: user._id,
        title: 'Setup MongoDB Atlas',
        description: 'Move to cloud MongoDB for production',
        priority: 'medium',
        category: 'Backend',
        completed: false,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
      {
        user: user._id,
        title: 'Write API Documentation',
        description: 'Document all API endpoints',
        priority: 'low',
        category: 'Documentation',
        completed: false,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      },
    ]);
    console.log('Sample tasks created:', tasks.length);

    // Create sample notes
    const notes = await Note.insertMany([
      {
        user: user._id,
        title: 'Data Structures Notes',
        content: 'Important points about arrays, linked lists, trees, and graphs',
        category: 'DSA',
      },
      {
        user: user._id,
        title: 'Database Design Patterns',
        content: 'Normalization, indexing strategies, and query optimization',
        category: 'DBMS',
      },
      {
        user: user._id,
        title: 'Operating Systems Concepts',
        content: 'Processes, threads, memory management, and scheduling algorithms',
        category: 'OS',
      },
      {
        user: user._id,
        title: 'React Best Practices',
        content: 'Component design, hooks patterns, and performance optimization',
        category: 'Frontend',
      },
      {
        user: user._id,
        title: 'System Design Interview Prep',
        content: 'Scalability, load balancing, caching strategies, and microservices',
        category: 'System Design',
      },
    ]);
    console.log('Sample notes created:', notes.length);

    // Create sample lectures
    const lectures = await Lecture.insertMany([
      {
        title: 'DSA - Arrays and Strings',
        instructor: 'Striver',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '2:15:32',
        category: 'DSA',
        thumbnail: 'https://via.placeholder.com/300x200?text=DSA+Arrays',
        savedBy: [],
      },
      {
        title: 'DBMS - SQL Basics',
        instructor: 'Code with Harry',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '3:45:00',
        category: 'DBMS',
        thumbnail: 'https://via.placeholder.com/300x200?text=DBMS+SQL',
        savedBy: [],
      },
      {
        title: 'OS - Process Management',
        instructor: 'Professor Oak',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '1:30:15',
        category: 'OS',
        thumbnail: 'https://via.placeholder.com/300x200?text=OS+Process',
        savedBy: [],
      },
      {
        title: 'React Hooks Deep Dive',
        instructor: 'Dan Abramov',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '2:00:00',
        category: 'Frontend',
        thumbnail: 'https://via.placeholder.com/300x200?text=React+Hooks',
        savedBy: [],
      },
      {
        title: 'System Design Interview',
        instructor: 'Grokking Systems',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '4:20:00',
        category: 'System Design',
        thumbnail: 'https://via.placeholder.com/300x200?text=System+Design',
        savedBy: [],
      },
      {
        title: 'Graph Algorithms',
        instructor: 'Striver',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '5:00:00',
        category: 'DSA',
        thumbnail: 'https://via.placeholder.com/300x200?text=Graph+Algo',
        savedBy: [],
      },
      {
        title: 'Node.js Best Practices',
        instructor: 'Traversy Media',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '2:30:00',
        category: 'Backend',
        thumbnail: 'https://via.placeholder.com/300x200?text=Node.js',
        savedBy: [],
      },
      {
        title: 'MongoDB Complete Guide',
        instructor: 'Maximilian Schwarzmüller',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '3:15:00',
        category: 'DBMS',
        thumbnail: 'https://via.placeholder.com/300x200?text=MongoDB',
        savedBy: [],
      },
    ]);
    console.log('Sample lectures created:', lectures.length);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Login Credentials:');
    console.log('Email:', user.email);
    console.log('Password: demo@123');
    console.log('\nSample Data:');
    console.log('Tasks:', tasks.length);
    console.log('Notes:', notes.length);
    console.log('Lectures:', lectures.length);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
