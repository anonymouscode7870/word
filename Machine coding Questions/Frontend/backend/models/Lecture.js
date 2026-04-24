const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String },
  url: { type: String },
  duration: { type: String },
  category: { type: String },
  thumbnail: { type: String },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Lecture', LectureSchema);
