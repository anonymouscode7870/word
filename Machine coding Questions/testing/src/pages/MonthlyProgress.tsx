import { useState } from "react";
import { HabitTracker } from "../types";
import { ProgressBar } from "../components/ProgressBar";

interface MonthlyProgressProps {
  trackers: HabitTracker[];
  isDark: boolean;
}

export function MonthlyProgress({ trackers, isDark }: MonthlyProgressProps) {
  // 1. Get current month key (e.g., "2026-04")
  const currentMonthKey = new Date().toISOString().slice(0, 7);

  // 2. Identify all months that have recorded data in history
  // This automatically creates a new tab whenever a new month starts
  const availableMonths = Array.from(
    new Set(
      trackers.flatMap((t) =>
        Object.keys(t.history || {}).map((date) => date.slice(0, 7))
      )
    )
  ).sort((a, b) => b.localeCompare(a)); // Newest months first

  // Ensure current month is always an option even if no data is recorded yet
  if (!availableMonths.includes(currentMonthKey)) {
    availableMonths.unshift(currentMonthKey);
  }

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  return (
    <div
      className={`rounded-lg border p-6 ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Subject Progress
        </h2>

        {/* Tab System for Months */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {availableMonths.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                selectedMonth === month
                  ? "bg-blue-600 text-white"
                  : isDark
                  ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {new Date(month + "-01").toLocaleString("default", {
                month: "short",
                year: "2-digit",
              })}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {trackers.map((tracker) => {
          // Calculate stats for the SELECTED month
          const [year, month] = selectedMonth.split("-").map(Number);
          const totalDaysInMonth = new Date(year, month, 0).getDate();

          const completedCount = Object.keys(tracker.history || {}).filter(
            (dateKey) =>
              dateKey.startsWith(selectedMonth) && tracker.history[dateKey]
          ).length;

          const percentage = Math.round((completedCount / totalDaysInMonth) * 100);

          return (
            <div key={tracker.id} className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${tracker.color} shadow-sm`} />
                  <span className={`font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}>
                    {tracker.subject}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isDark ? "bg-slate-900 text-blue-400" : "bg-blue-50 text-blue-600"
                  }`}>
                    {completedCount}/{totalDaysInMonth}
                  </span>
                  <span className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    {percentage}%
                  </span>
                </div>
              </div>

              <ProgressBar progress={percentage} color={tracker.color} isDark={isDark} />
              
              <p className={`text-[10px] mt-2 opacity-50 uppercase tracking-tighter font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                Monthly Target: {tracker.target}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}