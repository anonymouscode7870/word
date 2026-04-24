import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import { LectureCard } from "../components/LectureCard";
import { useAuth } from "../context/AuthContext";

interface Lecture {
  _id: string;
  title: string;
  instructor?: string;
  url?: string;
  duration?: string;
  category: string;
  thumbnail?: string;
  savedBy: string[];
  createdAt: string;
}

interface LecturesProps {
  isDark: boolean;
}

const API_BASE_URL = "http://localhost:5000/api";

export const Lectures = ({ isDark }: LecturesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const { setShowAuthModal, isLoggedIn } = useAuth();

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/lectures`);
      setLectures(res.data);
    } catch (err) {
      console.error("Failed to fetch lectures");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = [...new Set(lectures.map((l) => l.category))];

  // Filter lectures based on search and category
  const filteredLectures = useMemo(() => {
    return lectures.filter((lecture) => {
      const matchesSearch =
        lecture.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || lecture.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, lectures]);

  const handleLectureClick = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    }
  };

  return (
    <div
      className={`pt-20 min-h-screen ${isDark ? "bg-slate-950" : "bg-white"}`}
    >
      {/* Header */}
      <section
        className={`py-12 md:py-16 lg:py-20 px-4 ${isDark ? "bg-slate-900/50" : "bg-slate-50"}`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Video Lectures
            </h1>
            <p
              className={`text-base sm:text-lg md:text-xl ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Watch comprehensive video lectures on DSA, Operating Systems,
              DBMS, and more
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className={`relative rounded-xl border ${
                isDark
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-slate-200"
              } p-4 flex items-center gap-3`}
            >
              <Search
                size={24}
                className={isDark ? "text-slate-500" : "text-slate-400"}
              />
              <input
                type="text"
                placeholder="Search lectures by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 outline-none bg-transparent ${
                  isDark
                    ? "text-white placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </motion.div>

            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  !selectedCategory
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : isDark
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : isDark
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Results Info */}
          <p
            className={`text-sm mb-8 ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {loading ? "Loading..." : `Showing ${filteredLectures.length} of ${lectures.length} lectures`}
          </p>

          {/* Lecture Grid */}
          {loading ? (
            <div className={`text-center py-20 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Loading lectures...
            </div>
          ) : filteredLectures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLectures.map((lecture, index) => (
                <motion.div
                  key={lecture._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                  onClick={handleLectureClick}
                >
                  <LectureCard lecture={{ ...lecture, id: lecture._id }} isDark={isDark} />
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
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <p
                className={`text-2xl font-semibold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                No lectures found
              </p>
              <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                Try adjusting your search or category filters
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};
//               className="flex flex-wrap gap-3"
//             >
//               <button
//                 onClick={() => setSelectedCategory(null)}
//                 className={`px-6 py-2 rounded-lg font-semibold transition-all ${
//                   !selectedCategory
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                     : isDark
//                       ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
//                       : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 All Categories
//               </button>
//               {categories.map((category) => (
//                 <button
//                   key={category}
//                   onClick={() => setSelectedCategory(category)}
//                   className={`px-6 py-2 rounded-lg font-semibold transition-all ${
//                     selectedCategory === category
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
//                       : isDark
//                         ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                   }`}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </motion.div>
//           </div>

//           {/* Results Info */}
//           <p
//             className={`text-sm mb-8 ${
//               isDark ? "text-slate-400" : "text-slate-600"
//             }`}
//           >
//             Showing {filteredLectures.length} of {lectures.length} lectures
//           </p>

//           {/* Lecture Grid */}
//           {filteredLectures.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredLectures.map((lecture, index) => (
//                 <motion.div
//                   key={lecture.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05, duration: 0.3 }}
//                   viewport={{ once: true }}
//                 >
//                   <LectureCard lecture={lecture} isDark={isDark} />
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.3 }}
//               className={`text-center py-20 rounded-xl border ${
//                 isDark
//                   ? "bg-slate-800/50 border-slate-700"
//                   : "bg-slate-50 border-slate-200"
//               }`}
//             >
//               <p
//                 className={`text-2xl font-semibold mb-2 ${
//                   isDark ? "text-white" : "text-slate-900"
//                 }`}
//               >
//                 No lectures found
//               </p>
//               <p className={isDark ? "text-slate-400" : "text-slate-600"}>
//                 Try adjusting your search or category filters
//               </p>
//             </motion.div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };
