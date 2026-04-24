import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  isDark: boolean;
}

export const NoteCard = ({ note, isDark }: NoteCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="card-hover"
    >
      <div
        className={`rounded-xl overflow-hidden border transition-all duration-300 ${
          isDark
            ? 'bg-slate-800 border-slate-700 hover:border-indigo-600/50'
            : 'bg-white border-slate-200 hover:border-indigo-600/50'
        } p-6 h-full flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
            <FileText className="text-indigo-600" size={24} />
          </div>
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
            {note.category}
          </span>
        </div>

        {/* Title and Description */}
        <h3
          className={`font-bold text-lg mb-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {note.title}
        </h3>
        <p
          className={`text-sm mb-4 line-clamp-2 flex-grow ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {note.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            {note.pages} pages
          </span>
          <button
            onClick={() => alert('Download started!')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <Download size={16} />
            <span className="text-sm">Download</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
