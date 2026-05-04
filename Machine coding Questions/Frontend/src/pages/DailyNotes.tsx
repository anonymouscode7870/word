import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Calendar, Plus, Trash2, Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface DailyNote {
  _id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  mood: string;
}

interface DailyNotesProps {
  isDark: boolean;
}

export function DailyNotes({ isDark }: DailyNotesProps) {
  const { user, isLoggedIn } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [currentNote, setCurrentNote] = useState<Partial<DailyNote>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (isLoggedIn) {
      fetchNoteForDate();
    }
  }, [selectedDate, isLoggedIn]);

  const fetchNoteForDate = async () => {
    try {
      const token = localStorage.getItem("token");
      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await axios.get(
        `${API_BASE_URL}/daily-notes/date/${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data) {
        setCurrentNote(response.data);
      } else {
        setCurrentNote({
          date: selectedDate.toISOString(),
          title: "",
          content: "",
          tags: [],
          mood: "neutral",
        });
      }
    } catch (err) {
      console.error("Error fetching note:", err);
      setCurrentNote({
        date: selectedDate.toISOString(),
        title: "",
        content: "",
        tags: [],
        mood: "neutral",
      });
    }
  };

  const handleSaveNote = async () => {
    if (!currentNote.content && !currentNote.title) {
      alert("Please add some content");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/daily-notes`,
        {
          date: selectedDate.toISOString(),
          title:
            currentNote.title ||
            `Journal Entry - ${selectedDate.toDateString()}`,
          content: currentNote.content,
          tags: currentNote.tags || [],
          mood: currentNote.mood || "neutral",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsEditing(false);
      fetchNoteForDate();
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!currentNote._id) return;
    if (!confirm("Delete this note?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/daily-notes/${currentNote._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentNote({});
      fetchNoteForDate();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const moods = ["happy", "good", "neutral", "sad", "productive"];

  if (!isLoggedIn) {
    return (
      <div
        className={`min-h-screen pt-24 px-4 ${isDark ? "bg-slate-950" : "bg-white"}`}
      >
        <div
          className={`max-w-2xl mx-auto text-center py-20 ${isDark ? "text-slate-300" : "text-slate-700"}`}
        >
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-xl">Please login to create daily notes</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-24 px-4 pb-8 ${isDark ? "bg-slate-950" : "bg-white"}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            📔 Daily Journal
          </h1>
          <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Track your daily progress, mood, and reflections
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`md:col-span-1 p-6 rounded-xl ${
              isDark
                ? "bg-slate-900/50 border border-slate-700/50"
                : "bg-slate-50 border border-slate-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Select Date
            </h2>
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            />
            <p
              className={`mt-4 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              {selectedDate.toDateString()}
            </p>
          </motion.div>

          {/* Note Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`md:col-span-2 p-6 rounded-xl ${
              isDark
                ? "bg-slate-900/50 border border-slate-700/50"
                : "bg-slate-50 border border-slate-200"
            }`}
          >
            {!isEditing && currentNote._id ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2
                      className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {currentNote.title}
                    </h2>
                    <p
                      className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {new Date(currentNote.date || "").toDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDark
                        ? "bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    Edit
                  </button>
                </div>

                <p
                  className={`whitespace-pre-wrap mb-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  {currentNote.content}
                </p>

                {currentNote.mood && (
                  <div className="mb-4">
                    <span className="text-sm">Mood: {currentNote.mood}</span>
                  </div>
                )}

                {currentNote.tags && currentNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentNote.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDark
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDark
                        ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteNote}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      isDark
                        ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={currentNote.title || ""}
                    onChange={(e) =>
                      setCurrentNote({ ...currentNote, title: e.target.value })
                    }
                    placeholder="Journal Entry Title"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Mood
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setCurrentNote({ ...currentNote, mood })}
                        className={`px-4 py-2 rounded-lg capitalized transition-colors ${
                          currentNote.mood === mood
                            ? isDark
                              ? "bg-indigo-600 text-white"
                              : "bg-indigo-600 text-white"
                            : isDark
                              ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Content
                  </label>
                  <textarea
                    value={currentNote.content || ""}
                    onChange={(e) =>
                      setCurrentNote({
                        ...currentNote,
                        content: e.target.value,
                      })
                    }
                    placeholder="Write your thoughts, lessons learned, or today's progress..."
                    rows={8}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                    }`}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNote}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                      isDark
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                    }`}
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save Note"}
                  </button>
                  {currentNote._id && (
                    <button
                      onClick={() => fetchNoteForDate()}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                        isDark
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
