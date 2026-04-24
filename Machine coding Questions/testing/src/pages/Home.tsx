import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { LectureCard } from "../components/LectureCard";
import { lectures } from "../data/lectures";

interface HomeProps {
  isDark: boolean;
}

export const Home = ({ isDark }: HomeProps) => {
  const stats = [
    { label: "Total Subscribers", value: "150K+" },
    { label: "Video Tutorials", value: "100+" },
    { label: "Study Notes", value: "50+" },
    { label: "Success Rate", value: "98%" },
  ];

  const recentLectures = lectures.slice(0, 3);

  return (
    <div className={`pt-20 ${isDark ? "bg-slate-950" : "bg-white"}`}>
      {/* Hero Section */}
      <section
        className={`py-12 md:py-16 lg:py-20 px-4 ${isDark ? "bg-gradient-to-b from-slate-950 to-slate-900/50" : "bg-gradient-to-b from-white to-slate-50"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-600/50 mb-6"
              >
                <span className="text-indigo-600 font-semibold text-sm">
                  Welcome to Your Placement Journey ✨
                </span>
              </motion.div>

              <h1
                className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Master DSA, OS & DBMS for Your Dream Job
              </h1>

              <p
                className={`text-base sm:text-lg md:text-xl mb-8 leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Comprehensive video lectures, downloadable study notes, and
                interview prep resources to help you ace your placements.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/lectures"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Start Learning
                  <ArrowRight size={20} />
                </Link>
                <button
                  className={`btn-secondary inline-flex items-center justify-center gap-2`}
                >
                  Watch Demo
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 mt-8 pt-8 border-t border-slate-700/30">
                <div className="flex -space-x-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p
                    className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    150K+ Joined
                  </p>
                  <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                    Start your journey today
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-96 hidden md:block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <div
                className={`relative h-full rounded-3xl border ${
                  isDark
                    ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700"
                    : "bg-gradient-to-br from-slate-100 to-slate-50 border-slate-300"
                } flex items-center justify-center`}
              >
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-6xl"
                >
                  🚀
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        className={`py-12 md:py-16 lg:py-20 px-4 ${isDark ? "bg-slate-900/50" : "bg-slate-50"}`}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Our Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`rounded-2xl border p-8 text-center transition-all duration-300 hover:shadow-xl ${
                  isDark
                    ? "bg-slate-800 border-slate-700 hover:border-indigo-600/50"
                    : "bg-white border-slate-200 hover:border-indigo-600/50"
                }`}
              >
                <p
                  className={`text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {stat.label}
                </p>
                <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Videos Section */}
      <section
        className={`py-12 md:py-16 lg:py-20 px-4 ${isDark ? "bg-slate-950" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2
                className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Recent Lectures
              </h2>
              <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                Fresh content to boost your preparation
              </p>
            </div>
            <Link
              to="/lectures"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
            >
              View All
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLectures.map((lecture, index) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <LectureCard lecture={lecture} isDark={isDark} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`rounded-3xl border ${
              isDark
                ? "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700"
                : "bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700"
            } p-12 text-center`}
          >
            <h3 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of students who have successfully landed their
              dream placements with our comprehensive resources.
            </p>
            <Link
              to="/notes"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Explore Study Notes
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
