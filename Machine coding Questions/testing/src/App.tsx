import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Footer } from "./components";
import { Home, Lectures, Notes, About, Tasks } from "./pages";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [isDark, setIsDark] = useState(true);

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
    <AuthProvider>
      <Router>
        <div
          className={`flex flex-col min-h-screen transition-colors duration-300 ${isDark ? "dark bg-slate-950" : "bg-white"}`}
        >
          <Navbar isDark={isDark} onToggleDarkMode={toggleDarkMode} />

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
    </AuthProvider>
  );
}

export default App;
