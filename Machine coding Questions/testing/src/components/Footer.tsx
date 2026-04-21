import {   Mail } from 'lucide-react';

interface FooterProps {
  isDark: boolean;
}

export const Footer = ({ isDark }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950 border-slate-800'
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PJ</span>
              </div>
              <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Placement Journey
              </span>
            </div>
            <p
              className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Your complete guide to landing your dream placement
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Quick Links
            </h3>
            <ul
              className={`space-y-2 text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <li>
                <a href="/" className="hover:text-indigo-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/lectures"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Lectures
                </a>
              </li>
              <li>
                <a
                  href="/notes"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Notes
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-indigo-500 transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className={`font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Resources
            </h3>
            <ul
              className={`space-y-2 text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3
              className={`font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Connect
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-slate-800 text-slate-400 hover:text-indigo-400'
                    : 'bg-slate-200 text-slate-600 hover:text-indigo-600'
                }`}
              >
                <Mail size={20} />
              </a>
              <a
                href="#"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-slate-800 text-slate-400 hover:text-indigo-400'
                    : 'bg-slate-200 text-slate-600 hover:text-indigo-600'
                }`}
              >
                <Mail size={20} />
              </a>
              <a
                href="#"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-slate-800 text-slate-400 hover:text-indigo-400'
                    : 'bg-slate-200 text-slate-600 hover:text-indigo-600'
                }`}
              >
                <Mail size={20} />
              </a>
              <a
                href="#"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-slate-800 text-slate-400 hover:text-indigo-400'
                    : 'bg-slate-200 text-slate-600 hover:text-indigo-600'
                }`}
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`border-t pt-8 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className={`text-sm ${
                isDark ? 'text-slate-500' : 'text-slate-600'
              }`}
            >
              © {currentYear} Placement Journey. All rights reserved.
            </p>
            <p
              className={`text-sm ${
                isDark ? 'text-slate-500' : 'text-slate-600'
              }`}
            >
              Made with{' '}
              <span className="text-red-500">❤️</span> for aspiring engineers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
