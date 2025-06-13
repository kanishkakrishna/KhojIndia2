import { createContext, useContext, useState, useEffect } from "react";
import API from "../axios"; // Custom axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage safely when app starts
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user"); // optional cleanup
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
  };

  const signup = async (username, email, password) => {
    const res = await API.post("/auth/signup", { username, email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the auth context
export const useAuth = () => useContext(AuthContext);
