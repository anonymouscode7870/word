const express = require('express');
const Lecture = require('../models/Lecture');
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

// Get all lectures
router.get('/', async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get lectures saved by user
router.get('/saved', verifyToken, async (req, res) => {
  try {
    const lectures = await Lecture.find({ savedBy: req.user });
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Save lecture
router.post('/:id/save', verifyToken, async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    if (!lecture.savedBy.includes(req.user)) {
      lecture.savedBy.push(req.user);
      await lecture.save();
    }
    res.status(200).json(lecture);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Unsave lecture
router.post('/:id/unsave', verifyToken, async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    lecture.savedBy = lecture.savedBy.filter(id => id.toString() !== req.user);
    await lecture.save();
    res.status(200).json(lecture);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create lecture (admin)
router.post('/', async (req, res) => {
  const { title, instructor, url, duration, category, thumbnail } = req.body;
  try {
    const lecture = new Lecture({
      title,
      instructor,
      url,
      duration,
      category,
      thumbnail,
    });
    await lecture.save();
    res.status(201).json(lecture);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
