import { useState } from "react";
import { HabitTracker } from "../types";
import { daysOfWeek, calculateHabitProgress } from "../data/tasks";
import { CheckCircle2, Circle } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

interface WeeklyTrackerProps {
  trackers: HabitTracker[];
  onToggle: (trackerId: string, day: string) => void;
  isDark: boolean;
}

export function WeeklyTracker({
  trackers,
  onToggle,
  isDark,
}: WeeklyTrackerProps) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  return (
    <div
      className={`rounded-lg border overflow-hidden ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
    >
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr
              className={
                isDark
                  ? "bg-slate-900 border-b border-slate-700"
                  : "bg-gray-50 border-b border-gray-200"
              }
            >
              <th
                className={`px-4 py-4 text-left font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}
                style={{ minWidth: "180px" }}
              >
                Subject
              </th>
              <th
                className={`px-4 py-4 text-center font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}
                style={{ minWidth: "100px" }}
              >
                Target
              </th>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className={`px-3 py-4 text-center font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}
                  style={{ minWidth: "50px" }}
                >
                  {day.substring(0, 3)}
                </th>
              ))}
              <th
                className={`px-4 py-4 text-center font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}
                style={{ minWidth: "80px" }}
              >
                Progress
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {trackers.map((tracker, idx) => {
              const progress = calculateHabitProgress(tracker);
              return (
                <tr
                  key={tracker.id}
                  className={
                    idx % 2 === 0
                      ? isDark
                        ? "bg-slate-800"
                        : "bg-white"
                      : isDark
                        ? "bg-slate-750"
                        : "bg-gray-50"
                  }
                >
                  {/* Subject Name */}
                  <td
                    className={`px-4 py-4 font-medium ${isDark ? "text-slate-100" : "text-gray-900"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${tracker.color}`}
                      />
                      {tracker.subject}
                    </div>
                  </td>

                  {/* Target */}
                  <td
                    className={`px-4 py-4 text-center text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}
                  >
                    {tracker.target}
                  </td>

                  {/* Daily Checkboxes */}
                  {daysOfWeek.map((day) => (
                    <td key={day} className="px-3 py-4 text-center">
                      <button
                        onClick={() => onToggle(tracker.id, day)}
                        className="inline-flex items-center justify-center transition-transform hover:scale-110"
                        title={`Toggle ${day}`}
                      >
                        {tracker.weeklyProgress[day] ? (
                          <CheckCircle2
                            size={24}
                            className={`${tracker.color} text-white`}
                          />
                        ) : (
                          <Circle
                            size={24}
                            className={
                              isDark ? "text-slate-600" : "text-gray-300"
                            }
                          />
                        )}
                      </button>
                    </td>
                  ))}

                  {/* Progress Percentage */}
                  <td
                    className={`px-4 py-4 text-center font-semibold ${isDark ? "text-slate-200" : "text-gray-900"}`}
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${tracker.color} text-white`}
                    >
                      {progress}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {trackers.map((tracker, idx) => {
          const progress = calculateHabitProgress(tracker);
          const isExpanded = expandedSubject === tracker.id;

          return (
            <div
              key={tracker.id}
              className={`border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}
            >
              {/* Card Header */}
              <button
                onClick={() =>
                  setExpandedSubject(isExpanded ? null : tracker.id)
                }
                className={`w-full p-4 flex items-center justify-between ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-50"} transition`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${tracker.color}`} />
                  <div className="text-left">
                    <div
                      className={`font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                    >
                      {tracker.subject}
                    </div>
                    <div
                      className={`text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}
                    >
                      Target: {tracker.target}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold ${tracker.color} text-white`}
                >
                  {progress}%
                </span>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div
                  className={`px-4 py-4 ${isDark ? "bg-slate-700" : "bg-gray-50"} border-t ${isDark ? "border-slate-600" : "border-gray-200"}`}
                >
                  <div className="grid grid-cols-4 gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center">
                        <button
                          onClick={() => onToggle(tracker.id, day)}
                          className="mx-auto mb-2 inline-flex items-center justify-center transition-transform hover:scale-110"
                        >
                          {tracker.weeklyProgress[day] ? (
                            <CheckCircle2
                              size={20}
                              className={`${tracker.color} text-white`}
                            />
                          ) : (
                            <Circle
                              size={20}
                              className={
                                isDark ? "text-slate-500" : "text-gray-300"
                              }
                            />
                          )}
                        </button>
                        <div
                          className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}
                        >
                          {day.substring(0, 3)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
