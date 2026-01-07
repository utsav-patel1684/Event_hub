import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initial state LocalStorage se uthao
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("activeUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // 2. Login function mein LocalStorage save karo
  const loginUser = (email, password) => {
    setLoading(true);
    // Dummy check (aapka logic)
    const userData = { email, role: "user" }; 
    setUser(userData);
    localStorage.setItem("activeUser", JSON.stringify(userData));
    setLoading(false);
    return true;
  };

  
const loginAdmin = async (email, password) => {
  setLoading(true);
  try {
   
    const adminData = { email, role: "admin" };
    
    setUser(adminData);
    localStorage.setItem("activeUser", JSON.stringify(adminData));
    
    setLoading(false);
    return true; 
  } catch (error) {
    setLoading(false);
    return false;
  }
};

 
  const logout = () => {
    setUser(null);
    localStorage.removeItem("activeUser");
    window.location.href = "/login"; // Force redirect
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, loginAdmin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);