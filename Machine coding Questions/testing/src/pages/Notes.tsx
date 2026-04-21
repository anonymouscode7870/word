import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { NoteCard } from '../components/NoteCard';
import { notes } from '../data/notes';

interface NotesProps {
  isDark: boolean;
}

export const Notes = ({ isDark }: NotesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Get unique categories
  const categories = [...new Set(notes.map(n => n.category))].sort();

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(note.category);

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className={`pt-20 min-h-screen ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Header */}
      <section className={`py-16 px-4 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className={`text-5xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Study Notes Library
            </h1>
            <p
              className={`text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              Download comprehensive PDF notes for all your preparation needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Category Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className={`lg:col-span-1 space-y-4`}
            >
              {/* Filter Header for Mobile */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`lg:hidden w-full flex items-center justify-between px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                } font-semibold`}
              >
                <span>Filters</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    isFilterOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Filter Content */}
              {isFilterOpen && (
                <div
                  className={`rounded-xl border p-6 ${
                    isDark
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                  } space-y-4`}
                >
                  <h3
                    className={`font-bold text-lg ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Categories
                  </h3>

                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 accent-indigo-600 cursor-pointer"
                        />
                        <span
                          className={`font-medium transition-colors group-hover:text-indigo-600 ${
                            isDark
                              ? 'text-slate-300'
                              : 'text-slate-700'
                          }`}
                        >
                          {category}
                        </span>
                        <span
                          className={`text-sm ml-auto ${
                            isDark
                              ? 'text-slate-500'
                              : 'text-slate-500'
                          }`}
                        >
                          ({notes.filter(n => n.category === category).length})
                        </span>
                      </label>
                    ))}
                  </div>

                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="w-full px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-600/10 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Main Content - Search and Notes Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="lg:col-span-3 space-y-6"
            >
              {/* Search Bar */}
              <div className={`relative rounded-xl border ${
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
              } p-4 flex items-center gap-3`}>
                <Search
                  size={24}
                  className={isDark ? 'text-slate-500' : 'text-slate-400'}
                />
                <input
                  type="text"
                  placeholder="Search notes by title or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`flex-1 outline-none bg-transparent ${
                    isDark
                      ? 'text-white placeholder:text-slate-500'
                      : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {/* Results Info */}
              <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
              >
                Showing {filteredNotes.length} of {notes.length} notes
                {selectedCategories.length > 0 && ` in ${selectedCategories.length} categories`}
              </p>

              {/* Notes Grid */}
              {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <NoteCard note={note} isDark={isDark} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`text-center py-20 rounded-xl border ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-700'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <p
                    className={`text-2xl font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    No notes found
                  </p>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Try adjusting your search or category filters
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
