import { motion } from 'framer-motion';
import { Play, Badge } from 'lucide-react';
import { Lecture } from '../types';

interface LectureCardProps {
  lecture: Lecture;
  isDark: boolean;
}

export const LectureCard = ({ lecture, isDark }: LectureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="card-hover"
    >
      <a
        href={lecture.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block rounded-xl overflow-hidden ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
        } hover:shadow-2xl transition-all duration-300 group`}
      >
        {/* Thumbnail */}
        <div className="relative w-full h-48 overflow-hidden bg-slate-300">
          <img
            src={lecture.thumbnail}
            alt={lecture.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* New Badge */}
          {lecture.isNew && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Badge size={14} /> NEW
            </div>
          )}
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
              <Play size={24} className="text-red-600 fill-red-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
              {lecture.category}
            </span>
          </div>
          <h3
            className={`font-bold text-lg mb-2 line-clamp-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {lecture.title}
          </h3>
          <p
            className={`text-sm mb-4 line-clamp-2 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {lecture.description}
          </p>

          {/* CTA Button */}
          <div className="flex items-center gap-2 text-indigo-600 group/cta font-semibold">
            <Play size={16} className="group-hover/cta:translate-x-1 transition-transform" />
            <span>Watch on YouTube</span>
          </div>
        </div>
      </a>
    </motion.div>
  );
};
