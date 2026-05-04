require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Task = require("./models/Task");
const Note = require("./models/Note");
const Lecture = require("./models/Lecture");
const DailyNote = require("./models/DailyNote");
const Comment = require("./models/Comment");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected for seeding");

    try {
      // Clear existing data
      await User.deleteMany({});
      await Task.deleteMany({});
      await Note.deleteMany({});
      await Lecture.deleteMany({});
      await DailyNote.deleteMany({});
      await Comment.deleteMany({});
      console.log("Cleared existing data");

      // Create users
      const hashedPassword = await bcrypt.hash("demo@123", 10);

      const adminUser = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });

      const demoUser = new User({
        name: "Demo User",
        email: "demo@example.com",
        password: hashedPassword,
        role: "user",
      });

      await adminUser.save();
      await demoUser.save();
      console.log("Users created");

      // Create tasks for demo user
      const tasks = [
        {
          user: demoUser._id,
          title: "Complete JavaScript fundamentals",
          description: "Learn ES6, promises, async-await",
          priority: "high",
          category: "Programming",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          completed: false,
        },
        {
          user: demoUser._id,
          title: "DSA: Array problems",
          description: "Complete 10 array-based DSA problems",
          priority: "high",
          category: "DSA",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          completed: true,
        },
        {
          user: demoUser._id,
          title: "System Design study",
          description: "Learn database design patterns",
          priority: "medium",
          category: "System Design",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          completed: false,
        },
      ];

      await Task.insertMany(tasks);
      console.log("Tasks created");

      // Create notes for demo user
      const notes = [
        {
          user: demoUser._id,
          title: "React Hooks",
          content:
            "useState, useEffect, useContext are fundamental hooks for state management and side effects",
          category: "React",
        },
        {
          user: demoUser._id,
          title: "MongoDB Indexing",
          content:
            "Indexes improve query performance. Single field, compound, and unique indexes are common types.",
          category: "Database",
        },
      ];

      await Note.insertMany(notes);
      console.log("Notes created");

      // Create lectures with folder structure
      const lectures = [
        {
          title: "JavaScript ES6 Fundamentals",
          description: "Learn modern JavaScript with ES6 features",
          instructor: "Admin User",
          category: "Programming",
          folder: "Web Development/JavaScript",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          videoType: "youtube",
          duration: 45,
          thumbnail: "https://via.placeholder.com/320x180?text=JavaScript+ES6",
          lectureNotes:
            "Key concepts: arrow functions, destructuring, spread operator, promises",
          resources: [
            {
              title: "MDN Docs",
              url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            },
            {
              title: "ES6 Cheat Sheet",
              url: "https://example.com/es6-cheatsheet",
            },
          ],
          createdBy: adminUser._id,
          savedBy: [demoUser._id],
          views: 42,
        },
        {
          title: "React Component Patterns",
          description: "Master React components and hooks",
          instructor: "Admin User",
          category: "Frontend",
          folder: "Web Development/React",
          videoUrl: "https://www.youtube.com/embed/jLS0TkSLJ1g",
          videoType: "youtube",
          duration: 60,
          thumbnail: "https://via.placeholder.com/320x180?text=React+Patterns",
          lectureNotes: "Custom hooks, compound components, render props, HOCs",
          resources: [{ title: "React Docs", url: "https://react.dev" }],
          createdBy: adminUser._id,
          savedBy: [],
          views: 28,
        },
        {
          title: "MongoDB Fundamentals",
          description: "Database design and CRUD operations",
          instructor: "Admin User",
          category: "Backend",
          folder: "Backend/Databases",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          videoType: "youtube",
          duration: 55,
          thumbnail: "https://via.placeholder.com/320x180?text=MongoDB",
          lectureNotes:
            "Collections, documents, indexing, aggregation pipeline",
          resources: [],
          createdBy: adminUser._id,
          savedBy: [demoUser._id],
          views: 35,
        },
      ];

      await Lecture.insertMany(lectures);
      console.log("Lectures created");

      // Create daily notes for demo user
      const today = new Date();
      const dailyNotes = [
        {
          user: demoUser._id,
          date: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
          ),
          title: "Today's Learning",
          content:
            "Completed 5 LeetCode problems. Practiced binary search and sorting algorithms.",
          tags: ["DSA", "Progress"],
          mood: "productive",
        },
        {
          user: demoUser._id,
          date: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 1,
          ),
          title: "Yesterday",
          content:
            "Worked on React project. Fixed bugs and implemented new features.",
          tags: ["React", "Project"],
          mood: "good",
        },
      ];

      await DailyNote.insertMany(dailyNotes);
      console.log("Daily notes created");

      // Create comments for lectures
      const lectureForComments = await Lecture.findOne();
      const comments = [
        {
          lecture: lectureForComments._id,
          user: demoUser._id,
          userName: "Demo User",
          content: "Great explanation! Loved the practical examples.",
          rating: 5,
          replies: [
            {
              user: adminUser._id,
              userName: "Admin User",
              content: "Thank you! More advanced content coming soon.",
            },
          ],
        },
      ];

      await Comment.insertMany(comments);
      console.log("Comments created");

      console.log("\n✅ Seeding completed successfully!");
      console.log("\n=== Demo Credentials ===");
      console.log("Admin Email: admin@example.com");
      console.log("Demo Email: demo@example.com");
      console.log("Password: demo@123");
      console.log("========================\n");

      process.exit(0);
    } catch (err) {
      console.error("Error during seeding:", err);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
