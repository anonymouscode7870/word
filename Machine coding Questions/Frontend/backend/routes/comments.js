const express = require("express");
const Comment = require("../models/Comment");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Get all comments for a lecture
router.get("/lecture/:lectureId", async (req, res) => {
  try {
    const comments = await Comment.find({ lecture: req.params.lectureId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create comment
router.post("/", verifyToken, async (req, res) => {
  try {
    const { lecture, content, rating } = req.body;

    if (!lecture || !content) {
      return res.status(400).json({ message: "Lecture and content required" });
    }

    const comment = new Comment({
      lecture,
      user: req.userId,
      userName: req.user.name || req.user.email,
      content,
      rating,
    });

    await comment.save();
    await comment.populate("user", "name email");

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add reply to comment
router.post("/:commentId/reply", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Reply content required" });
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({
      user: req.userId,
      userName: req.user.name || req.user.email,
      content,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete comment
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
