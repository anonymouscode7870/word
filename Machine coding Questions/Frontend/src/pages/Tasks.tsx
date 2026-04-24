import { useState } from "react";
import { HabitTracker } from "../types";
import {
  habitTrackers,
  daysOfWeek,
  calculateHabitProgress,
  calculateTotalProgress,
} from "../data/tasks";
import { ContributionGraph } from "../components/ContributionGraph";
import { WeeklyTracker } from "../components/WeeklyTracker";
import { ProgressBar } from "../components/ProgressBar";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { TrendingUp, Target } from "lucide-react";
import { MonthlyProgress } from "./MonthlyProgress";
import { TaskForm } from "../components/TaskForm";

interface TasksPageProps {
  isDark: boolean;
}

export function Tasks({ isDark }: TasksPageProps) {
  const { isLoggedIn } = useAuth();
  const [trackers, setTrackers] = useState<HabitTracker[]>(habitTrackers);
  const [isAuthOpen, setIsAuthOpen] = useState(!isLoggedIn);

  // Toggle daily completion
  const handleToggleDay = (trackerId: string, day: string) => {
    setTrackers((prevTrackers) =>
      prevTrackers.map((tracker) =>
        tracker.id === trackerId
          ? {
              ...tracker,
              weeklyProgress: {
                ...tracker.weeklyProgress,
                [day]: !tracker.weeklyProgress[day],
              },
            }
          : tracker,
      ),
    );
  };

  // Calculate total progress
  const totalProgress = calculateTotalProgress(trackers);

  // Reset weekly progress
  const handleResetWeek = () => {
    if (confirm("Reset all progress for this week?")) {
      setTrackers((prevTrackers) =>
        prevTrackers.map((tracker) => ({
          ...tracker,
          weeklyProgress: {
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
            Sunday: false,
          },
        })),
      );
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <div
          className={`min-h-screen flex items-center justify-center pt-20 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}
        >
          <div
            className={`text-center p-8 rounded-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
          >
            <h1
              className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Login Required
            </h1>
            <p className={isDark ? "text-slate-400" : "text-gray-600"}>
              Please log in to access the task management system
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}
    >
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1
              className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Study Tracker
            </h1>
            <p
              className={`mt-2 ${isDark ? "text-slate-400" : "text-gray-600"}`}
            >
              Track your daily progress across all subjects
            </p>
          </div>
          <button
            onClick={handleResetWeek}
            className={`px-6 py-3 rounded-lg font-semibold transition ${isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"}`}
          >
            Reset Week
          </button>
        </div>

        {/* Overall Progress */}
        <div
          className={`rounded-lg border p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-blue-500" size={28} />
            <div>
              <h2
                className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Weekly Progress
              </h2>
              <p className={isDark ? "text-slate-400" : "text-gray-600"}>
                Overall completion rate
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Progress Bar */}
            <div>
              <ProgressBar
                progress={totalProgress}
                label="Total Progress"
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                isDark={isDark}
              />
              <p
                className={`mt-4 text-lg font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}
              >
                {totalProgress}% Complete
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg ${isDark ? "bg-slate-700" : "bg-gray-100"}`}
              >
                <div
                  className={`text-3xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
                >
                  {trackers.length}
                </div>
                <div
                  className={`text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}
                >
                  Total Subjects
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${isDark ? "bg-slate-700" : "bg-gray-100"}`}
              >
                <div
                  className={`text-3xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
                >
                  {trackers.reduce(
                    (sum, t) =>
                      sum +
                      Object.values(t.weeklyProgress).filter((v) => v).length,
                    0,
                  )}
                </div>
                <div
                  className={`text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}
                >
                  Tasks Done
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Tracker Table */}
        <div
          className={`rounded-lg border p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-purple-500" size={28} />
            <h2
              className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Weekly Targets
            </h2>
            {/* <TaskForm></TaskForm> */}
            
          </div>

          <WeeklyTracker
            trackers={trackers}
            onToggle={handleToggleDay}
            isDark={isDark}
          />
        </div>

        {/* Subject Progress Bars */}
        {/* <div
          className={`rounded-lg border p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Subject Progress
          </h2> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <MonthlyProgress trackers={trackers} isDark={isDark} />
          </div>
            {/* {trackers.map((tracker) => (
              <div key={tracker.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-4 h-4 rounded-full ${tracker.color}`} />
                  <span
                    className={`font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                  >
                    {tracker.subject}
                  </span>
                  <span
                    className={`text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}
                  >
                    ({tracker.target})
                  </span>
                </div>
                <ProgressBar
                  progress={calculateHabitProgress(tracker)}
                  color={tracker.color}
                  isDark={isDark}
                />
              </div>
            ))}
          </div> */}
        {/* </div> */} */

        {/* Contribution Graph */}
        <div>
          <ContributionGraph tasks={[]} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}
