interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
  isDark: boolean;
}

export function ProgressBar({
  progress,
  label,
  color = "bg-blue-500",
  isDark,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span
            className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}
          >
            {label}
          </span>
          <span
            className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-gray-900"}`}
          >
            {progress}%
          </span>
        </div>
      )}
      <div
        className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-gray-200"}`}
      >
        <div
          className={`h-full ${color} transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}