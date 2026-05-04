const express = require("express");
const DailyNote = require("../models/DailyNote");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Get daily note for specific date
router.get("/date/:date", verifyToken, async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(req.params.date);
    endDate.setHours(23, 59, 59, 999);

    const note = await DailyNote.findOne({
      user: req.userId,
      date: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json(note || null);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all daily notes for user (calendar view)
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await DailyNote.find({ user: req.userId }).sort({ date: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get daily notes for a month
router.get("/month/:year/:month", verifyToken, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month) - 1; // 0-indexed

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const notes = await DailyNote.find({
      user: req.userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create or update daily note
router.post("/", verifyToken, async (req, res) => {
  try {
    const { date, title, content, tags, mood } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Check if note exists for this date
    let note = await DailyNote.findOne({
      user: req.userId,
      date: { $gte: startDate, $lte: endDate },
    });

    if (note) {
      // Update existing
      note.title = title || note.title;
      note.content = content || note.content;
      note.tags = tags || note.tags;
      note.mood = mood || note.mood;
      note.updatedAt = Date.now();
    } else {
      // Create new
      note = new DailyNote({
        user: req.userId,
        date: new Date(date),
        title,
        content,
        tags,
        mood,
      });
    }

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete daily note
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const note = await DailyNote.findById(req.params.id);
    if (!note || note.user.toString() !== req.userId) {
      return res.status(404).json({ message: "Note not found" });
    }

    await DailyNote.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Daily note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
