const mongoose = require("mongoose");

const DailyNoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true }, // The date of the note
    title: { type: String },
    content: { type: String },
    tags: [{ type: String }],
    mood: { type: String }, // optional: happy, sad, neutral, focused, etc.
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Index for efficient querying by user and date
DailyNoteSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("DailyNote", DailyNoteSchema);
