import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("cm_token");
    if (token) {
      api.get("/auth/profile").then(res => setUser(res.data.data)).catch(() => localStorage.removeItem("cm_token")).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);
  const login = (token, userData) => { localStorage.setItem("cm_token", token); setUser(userData); };
  const logout = () => { localStorage.removeItem("cm_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
