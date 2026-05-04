import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar = ({ isDark, onToggleDarkMode }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Lectures", path: "/lectures" },
    { name: "Notes", path: "/notes" },
    { name: "Tasks", path: "/tasks" },
    { name: "About", path: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 w-full z-50 ${
        isDark
          ? "bg-slate-950/40 border-b border-slate-700/30"
          : "bg-white/40 border-b border-white/30"
      } glass backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PJ</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Placement Journey
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-300 ${
                  isDark
                    ? "text-slate-300 hover:text-indigo-400"
                    : "text-slate-700 hover:text-indigo-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  {user?.email}
                </span>
                <button
                  onClick={logout}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "bg-slate-800/50 text-red-400 hover:bg-slate-700/50"
                      : "bg-white/50 text-red-600 hover:bg-white/70"
                  }`}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}

            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-slate-800/50 text-yellow-400 hover:bg-slate-700/50"
                  : "bg-white/50 text-slate-700 hover:bg-white/70"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                  : "bg-white/50 text-slate-700 hover:bg-white/70"
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`md:hidden pb-4 space-y-2 ${
              isDark ? "bg-slate-900/50" : "bg-white/30"
            } rounded-b-lg`}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? "text-slate-300 hover:bg-slate-800/50"
                    : "text-slate-700 hover:bg-white/50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isDark
                    ? "text-red-400 hover:bg-slate-800/50"
                    : "text-red-600 hover:bg-white/50"
                }`}
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
