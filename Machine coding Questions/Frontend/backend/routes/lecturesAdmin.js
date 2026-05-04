const express = require("express");
const Lecture = require("../models/Lecture");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

// Get all lectures (public)
router.get("/", async (req, res) => {
  try {
    const { category, folder } = req.query;
    let query = {};

    if (category) query.category = category;
    if (folder) query.folder = folder;

    const lectures = await Lecture.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get lecture by ID
router.get("/:id", async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("savedBy", "name email");

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Increment views
    lecture.views = (lecture.views || 0) + 1;
    await lecture.save();

    res.status(200).json(lecture);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get folder structure (admin)
router.get("/folder/list", async (req, res) => {
  try {
    const folders = await Lecture.distinct("folder");
    res.status(200).json(folders.filter((f) => f));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create lecture (admin only)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      category,
      folder,
      videoUrl,
      videoType,
      duration,
      thumbnail,
      lectureNotes,
      resources,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    const lecture = new Lecture({
      title,
      description,
      instructor,
      category,
      folder,
      videoUrl,
      videoType,
      duration,
      thumbnail,
      lectureNotes,
      resources,
      createdBy: req.userId,
    });

    await lecture.save();
    res.status(201).json(lecture);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update lecture (admin only)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    const {
      title,
      description,
      instructor,
      category,
      folder,
      videoUrl,
      videoType,
      duration,
      thumbnail,
      lectureNotes,
      resources,
    } = req.body;

    if (title !== undefined) lecture.title = title;
    if (description !== undefined) lecture.description = description;
    if (instructor !== undefined) lecture.instructor = instructor;
    if (category !== undefined) lecture.category = category;
    if (folder !== undefined) lecture.folder = folder;
    if (videoUrl !== undefined) lecture.videoUrl = videoUrl;
    if (videoType !== undefined) lecture.videoType = videoType;
    if (duration !== undefined) lecture.duration = duration;
    if (thumbnail !== undefined) lecture.thumbnail = thumbnail;
    if (lectureNotes !== undefined) lecture.lectureNotes = lectureNotes;
    if (resources !== undefined) lecture.resources = resources;

    await lecture.save();
    res.status(200).json(lecture);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete lecture (admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    await Lecture.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Lecture deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Save lecture (user)
router.post("/:id/save", verifyToken, async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (!lecture.savedBy.includes(req.userId)) {
      lecture.savedBy.push(req.userId);
      await lecture.save();
    }

    res.status(200).json(lecture);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Unsave lecture (user)
router.post("/:id/unsave", verifyToken, async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    lecture.savedBy = lecture.savedBy.filter(
      (id) => id.toString() !== req.userId,
    );
    await lecture.save();

    res.status(200).json(lecture);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user's saved lectures
router.get("/user/saved", verifyToken, async (req, res) => {
  try {
    const lectures = await Lecture.find({ savedBy: req.userId }).populate(
      "createdBy",
      "name email",
    );

    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
