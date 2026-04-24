import { Task } from "../types";
import { X } from "lucide-react";
import { useState } from "react";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  editingTask?: Task;
  isDark: boolean;
}

const categories = [
  "Learning",
  "Bug Fix",
  "Design",
  "Backend",
  "Documentation",
  "Review",
  "Optimization",
  "Deployment",
  "Other",
];

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  isDark,
}: TaskFormProps) {
  const [title, setTitle] = useState(editingTask?.title || "");
  const [description, setDescription] = useState(
    editingTask?.description || "",
  );
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || "");
  const [category, setCategory] = useState(editingTask?.category || "Learning");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!dueDate) {
      setError("Due date is required");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      category,
      completed: editingTask?.completed || false,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setDueDate("");
    setCategory("Learning");
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${isDark ? "bg-slate-800" : "bg-white"} rounded-lg shadow-2xl w-96 border ${isDark ? "border-slate-700" : "border-gray-200"}`}
      >
        <div
          className={`flex justify-between items-center p-6 border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}
        >
          <h2
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {editingTask ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className={
              isDark
                ? "text-slate-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"} mb-2`}
            >
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isDark
                  ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"} mb-2`}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isDark
                  ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"} mb-2`}
            >
              Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isDark
                  ? "bg-slate-700 border border-slate-600 text-white"
                  : "bg-gray-50 border border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"} mb-2`}
            >
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isDark
                  ? "bg-slate-700 border border-slate-600 text-white"
                  : "bg-gray-50 border border-gray-300 text-gray-900"
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div
              className={`p-3 border rounded-lg text-sm ${isDark ? "bg-red-900 border-red-700 text-red-200" : "bg-red-50 border-red-300 text-red-700"}`}
            >
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition"
            >
              {editingTask ? "Update Task" : "Add Task"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
