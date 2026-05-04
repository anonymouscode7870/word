const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: String },
    category: { type: String },
    folder: { type: String }, // Folder/subfolder path for organization

    // Video Content
    videoUrl: { type: String }, // Embedded video URL or local file path
    videoType: {
      type: String,
      enum: ["youtube", "vimeo", "file", "html5"],
      default: "youtube",
    },
    duration: { type: String },
    thumbnail: { type: String },

    // Content Materials
    lectureNotes: { type: String }, // URL or embedded notes content
    resources: [
      {
        title: { type: String },
        url: { type: String },
        type: { type: String }, // pdf, doc, link, etc.
      },
    ],

    // Admin Content Management
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Student Interactions
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lecture", LectureSchema);
