const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get all tasks for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get task by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create task
router.post('/', verifyToken, async (req, res) => {
  const { title, description, dueDate, priority, category } = req.body;
  try {
    const task = new Task({
      user: req.user,
      title,
      description,
      dueDate,
      priority,
      category,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, completed, dueDate, priority, category } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (category) task.category = category;
    task.updatedAt = Date.now();

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;