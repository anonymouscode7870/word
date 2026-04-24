import { useState, useMemo } from "react";
import { Task } from "../types";

// --- SUBJECT CONFIGURATION ---
const SUBJECT_CONFIG: { [key: string]: string } = {
  Math: "bg-blue-500",
  Physics: "bg-purple-500",
  React: "bg-cyan-400",
  English: "bg-amber-400",
};

// --- DUMMY DATA GENERATOR ---
const generateDummyTasks = (): Task[] => {
  const tasks: Task[] = [];
  const subjects = Object.keys(SUBJECT_CONFIG);
  const start = new Date(2026, 0, 1);
  const end = new Date(2027, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    
    // Simulate high activity on some days, laziness on others
    const activityRoll = Math.random();
    let dailyCount = 0;
    if (activityRoll > 0.8) dailyCount = 5;      // High productivity day
    else if (activityRoll > 0.3) dailyCount = 2; // Average day
    
    for (let i = 0; i < dailyCount; i++) {
      tasks.push({
        id: Math.random().toString(),
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        completed: true,
        dueDate: dateStr,
        target: "Daily",
        color: "", // Handled by SUBJECT_CONFIG
      });
    }
  }
  return tasks;
};

const DUMMY_TASKS = generateDummyTasks();

export function ContributionGraph({ isDark }: { isDark: boolean }) {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

  // --- ANALYTICAL DATA ENGINE ---
  const data = useMemo(() => {
    const map: { [key: string]: { count: number; breakdown: { [sub: string]: number }; subjects: string[] } } = {};
    
    DUMMY_TASKS.forEach((task) => {
      if (task.completed && task.dueDate) {
        if (!map[task.dueDate]) {
          map[task.dueDate] = { count: 0, breakdown: {}, subjects: [] };
        }
        map[task.dueDate].count++;
        map[task.dueDate].breakdown[task.subject] = (map[task.dueDate].breakdown[task.subject] || 0) + 1;
        if (!map[task.dueDate].subjects.includes(task.subject)) {
          map[task.dueDate].subjects.push(task.subject);
        }
      }
    });
    return map;
  }, []);

  const maxTasks = useMemo(() => Math.max(...Object.values(data).map(d => d.count), 1), [data]);

  // --- SHARED TOOLTIP ---
  const Tooltip = ({ date, count, breakdown }: any) => (
    <div className={`p-3 rounded-xl border shadow-2xl min-w-[160px] animate-in fade-in zoom-in-95 duration-200 ${
      isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-gray-200 text-slate-900"
    }`}>
      <p className="text-[10px] font-black opacity-40 mb-2 uppercase tracking-tighter">{date}</p>
      <p className="text-sm font-black text-blue-500 mb-2">{count} Tasks</p>
      <div className="space-y-1.5">
        {Object.entries(breakdown || {}).map(([sub, val]: any) => (
          <div key={sub} className="flex justify-between items-center text-[10px]">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${SUBJECT_CONFIG[sub]}`} />
              <span className="font-bold opacity-80">{sub}</span>
            </div>
            <span className="font-black">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // --- YEAR VIEW (MOSAIC GRID) ---
  const renderYear = () => {
    const monthsArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return (
      <div className="flex flex-wrap gap-4 justify-center animate-in fade-in duration-700">
        {monthsArr.map((m) => (
          <div key={m} className="flex flex-col gap-2">
            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest text-center">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m]}
            </span>
            <div className="grid grid-rows-7 grid-flow-col gap-1">
              {Array.from({ length: new Date(selectedYear, m + 1, 0).getDate() }).map((_, d) => {
                const dateStr = new Date(selectedYear, m, d + 1).toISOString().split("T")[0];
                const dayData = data[dateStr] || { count: 0, breakdown: {}, subjects: [] };
                return (
                  <div key={d} className="relative group">
                    <div className={`h-2.5 w-2.5 rounded-sm cursor-pointer transition-all duration-300 ${
                      dayData.count > 0 ? "bg-blue-500 shadow-sm shadow-blue-500/40 scale-105" : isDark ? "bg-slate-700" : "bg-gray-200"
                    }`} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[100]">
                      <Tooltip date={dateStr} count={dayData.count} breakdown={dayData.breakdown} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // --- WEEK/MONTH VIEW (ANALYTICAL SPIKES) ---
  const renderSpikes = (isWeek: boolean) => {
    const items = isWeek ? 7 : new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return (
      <div className={`flex items-end h-64 w-full px-4 animate-in slide-in-from-bottom-8 duration-500 ${isWeek ? 'gap-6' : 'gap-1.5'}`}>
        {Array.from({ length: items }).map((_, i) => {
          const d = isWeek ? new Date() : new Date(selectedYear, selectedMonth, i + 1);
          if (isWeek) d.setDate(d.getDate() - (6 - i));
          const dateStr = d.toISOString().split('T')[0];
          const entry = data[dateStr] || { count: 0, breakdown: {}, subjects: [] };

          return (
            <div key={i} className="flex-1 flex flex-col-reverse group relative h-full">
              {Object.entries(entry.breakdown || {}).map(([sub, count]: any) => (
                <div key={sub} className={`${SUBJECT_CONFIG[sub]} w-full transition-all duration-500 first:rounded-b-md last:rounded-t-md border-t border-white/10`}
                  style={{ height: `${(count / maxTasks) * 100}%` }} />
              ))}
              {/* Subtle Day Label for Weeks */}
              {isWeek && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-30 uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>}
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[100]">
                <Tooltip date={dateStr} count={entry.count} breakdown={entry.breakdown} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all ${isDark ? "bg-[#0f172a] border-slate-800" : "bg-white border-gray-100 shadow-2xl shadow-blue-500/5"}`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
        <div>
          <h3 className={`text-3xl font-black tracking-tighter italic uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
            Analytics <span className="text-blue-600">Spikes</span>
          </h3>
          <div className="flex flex-wrap gap-3 mt-4">
            {Object.entries(SUBJECT_CONFIG).map(([sub, color]) => (
              <div key={sub} className="flex items-center gap-2 bg-slate-900/5 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-slate-700/20 transition-all">
                <div className={`w-2 h-2 rounded-full ${color} shadow-sm`} />
                <span className="text-[9px] font-black uppercase opacity-60 tracking-wider">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-1 p-1.5 bg-slate-900/10 rounded-2xl">
          {['week', 'month', 'year'].map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode as any)}
              className={`px-7 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                viewMode === mode ? "bg-blue-600 text-white shadow-xl scale-105" : "text-slate-500 hover:text-blue-500"
              }`}>
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="min-h-[300px] w-full flex items-center justify-center">
        {viewMode === 'year' ? renderYear() : renderSpikes(viewMode === 'week')}
      </div>

      {/* Data Persistence Selectors */}
      <div className="mt-16 flex flex-col md:flex-row justify-between items-end border-t border-slate-800/20 pt-10 gap-8">
        <div className="flex gap-10">
          <div className="flex flex-col">
            <span className="text-[9px] font-black opacity-30 uppercase mb-3 tracking-widest">Timeframe</span>
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} 
              className="bg-transparent text-xs font-black uppercase text-blue-600 outline-none cursor-pointer hover:translate-x-1 transition-transform">
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black opacity-30 uppercase mb-3 tracking-widest">Cycle Year</span>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} 
              className="bg-transparent text-xs font-black uppercase text-blue-600 outline-none cursor-pointer hover:translate-x-1 transition-transform">
              {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        
        <div className="text-right group cursor-help">
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] mb-2 group-hover:text-blue-500 transition-colors">Consistency Diagnostic</p>
          <p className={`text-[11px] font-bold italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Look for subject color gaps to identify where you lack focus.
          </p>
        </div>
      </div>
    </div>
  );
}