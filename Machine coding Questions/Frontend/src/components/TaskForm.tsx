import { useState } from "react";

interface TaskFormProps {
  onAdd: (task: {
    title: string;
    description: string;
    dueDate?: string;
    priority: string;
    category?: string;
  }) => void;
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

const priorities = ["low", "medium", "high"];

export function TaskForm({ onAdd, isDark }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Learning");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setLoading(true);
    try {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        category,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setCategory("Learning");
    } catch (err: any) {
      setError(err.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={loading}
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
          disabled={loading}
          rows={2}
          className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            isDark
              ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-500"
              : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"} mb-2`}
          >
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
            disabled={loading}
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
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              isDark
                ? "bg-slate-700 border border-slate-600 text-white"
                : "bg-gray-50 border border-gray-300 text-gray-900"
            }`}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
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
          disabled={loading}
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
        <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
//               className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"} mb-2`}
//             >
//               Task Title *
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter task title"
//               className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                 isDark
//                   ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-500"
//                   : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"
//               }`}
//             />
//           </div>

//           <div>
//             <label
//               className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"} mb-2`}
//             >
//               Description
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter task description"
//               rows={3}
//               className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                 isDark
//                   ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-500"
//                   : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500"
//               }`}
//             />
//           </div>

//           <div>
//             <label
//               className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"} mb-2`}
//             >
//               Due Date *
//             </label>
//             <input
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               min={today}
//               className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                 isDark
//                   ? "bg-slate-700 border border-slate-600 text-white"
//                   : "bg-gray-50 border border-gray-300 text-gray-900"
//               }`}
//             />
//           </div>

//           <div>
//             <label
//               className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"} mb-2`}
//             >
//               Category
//             </label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
//                 isDark
//                   ? "bg-slate-700 border border-slate-600 text-white"
//                   : "bg-gray-50 border border-gray-300 text-gray-900"
//               }`}
//             >
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {error && (
//             <div
//               className={`p-3 border rounded-lg text-sm ${isDark ? "bg-red-900 border-red-700 text-red-200" : "bg-red-50 border-red-300 text-red-700"}`}
//             >
//               {error}
//             </div>
//           )}

//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition"
//             >
//               {editingTask ? "Update Task" : "Add Task"}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
//                 isDark
//                   ? "bg-slate-700 hover:bg-slate-600 text-white"
//                   : "bg-gray-200 hover:bg-gray-300 text-gray-900"
//               }`}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
