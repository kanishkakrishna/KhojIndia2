import { createContext, useContext, useState, useEffect } from "react";
import API from "../axios"; // Custom axios instance
import jwtDecode from "jwt-decode"; // ✅ import decoder

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load token and decode user from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUser(decoded);
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
      localStorage.removeItem("token");
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const token = res.data.token;

    // ✅ Decode user info from token
    const decoded = jwtDecode(token);
    setUser(decoded);

    localStorage.setItem("token", token);
  };

  const signup = async (username, email, password) => {
    const res = await API.post("/auth/signup", { username, email, password });
    const token = res.data.token;

    const decoded = jwtDecode(token);
    setUser(decoded);

    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
