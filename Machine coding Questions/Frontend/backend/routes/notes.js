const express = require('express');
const Note = require('../models/Note');
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

// Get all notes for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get note by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create note
router.post('/', verifyToken, async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const note = new Note({
      user: req.user,
      title,
      content,
      category,
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update note
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const { title, content, category } = req.body;
    if (title) note.title = title;
    if (content) note.content = content;
    if (category) note.category = category;
    note.updatedAt = Date.now();

    await note.save();
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete note
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
