const express = require("express");
const Task = require("../models/Task");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Get all tasks for user (with history)
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get task by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.userId) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create task
router.post("/", verifyToken, async (req, res) => {
  const { title, description, dueDate, priority, category } = req.body;
  try {
    const task = new Task({
      user: req.userId,
      title,
      description,
      dueDate,
      priority,
      category,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update task (including completion toggle)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.userId) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, completed, dueDate, priority, category } =
      req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    task.updatedAt = Date.now();

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete task (soft delete - keep in history)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.userId) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get task statistics (for dashboard)
router.get("/stats/summary", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.filter((t) => !t.completed).length;

    res.status(200).json({
      total: tasks.length,
      completed,
      pending,
      completionRate:
        tasks.length > 0 ? ((completed / tasks.length) * 100).toFixed(2) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
