import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Footer, AuthModal } from "./components";
import { Home, Lectures, Notes, About, Tasks } from "./pages";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const [isDark, setIsDark] = useState(true);
  const { showAuthModal, setShowAuthModal } = useAuth();

  useEffect(() => {
    // Check for saved dark mode preference or default to dark
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      setIsDark(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Update localStorage and apply dark mode class to document
    localStorage.setItem("darkMode", JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <Router>
      <div
        className={`flex flex-col min-h-screen transition-colors duration-300 ${isDark ? "dark bg-slate-950" : "bg-white"}`}
      >
        <Navbar isDark={isDark} onToggleDarkMode={toggleDarkMode} />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home isDark={isDark} />} />
            <Route path="/lectures" element={<Lectures isDark={isDark} />} />
            <Route path="/notes" element={<Notes isDark={isDark} />} />
            <Route path="/about" element={<About isDark={isDark} />} />
            <Route path="/tasks" element={<Tasks isDark={isDark} />} />
          </Routes>
        </main>

        <Footer isDark={isDark} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
