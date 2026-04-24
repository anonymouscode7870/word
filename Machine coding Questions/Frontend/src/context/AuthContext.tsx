import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setShowAuthModal(false);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setShowAuthModal(false);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        showAuthModal,
        setShowAuthModal,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
